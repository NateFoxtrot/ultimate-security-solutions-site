#!/usr/bin/env python3
"""
Download product images for LTS (LT Security) SKUs listed in missing_images_skus.txt.
Converts each image to WebP and saves to lts-dual-catalog/images/{sku}.webp.

Strategy:
  1. Try fetching the product page directly from ltsecurityinc.com using known URL patterns.
  2. Fall back to DuckDuckGo image search if the direct approach fails.
  3. Download the best candidate image, convert to WebP, and save.
"""

import os
import sys
import time
import re
import hashlib
import urllib.parse
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
INPUT_FILE = "test_skus.txt"
OUTPUT_DIR = Path("lts-dual-catalog/images")
REQUEST_TIMEOUT = 15  # seconds
MIN_IMAGE_SIZE = 5_000  # bytes – reject tiny placeholder / spacer images
MAX_IMAGE_DIM = 2000  # px – resize if larger to keep files reasonable
WEBP_QUALITY = 85
DELAY_BETWEEN_REQUESTS = 1.5  # seconds – be polite to servers

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

session = requests.Session()
session.headers.update(HEADERS)


# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------

def read_skus(filepath: str) -> list[str]:
    """Read SKUs from a text file (one per line, ignores blanks / comments)."""
    skus = []
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                skus.append(line)
    return skus


def is_valid_image_url(url: str) -> bool:
    """Heuristic check that a URL looks like it points to a real image."""
    lower = url.lower()
    return any(ext in lower for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"))


def download_image_bytes(url: str) -> bytes | None:
    """Download an image and return raw bytes, or None on failure."""
    try:
        resp = session.get(url, timeout=REQUEST_TIMEOUT, stream=True)
        resp.raise_for_status()
        content_type = resp.headers.get("Content-Type", "")
        if "image" not in content_type and not is_valid_image_url(url):
            return None
        data = resp.content
        if len(data) < MIN_IMAGE_SIZE:
            return None
        return data
    except requests.RequestException:
        return None


def save_as_webp(image_bytes: bytes, dest: Path) -> bool:
    """Convert raw image bytes to WebP and save. Returns True on success."""
    try:
        img = Image.open(BytesIO(image_bytes))
        # Convert RGBA/P palette modes so WebP export works cleanly
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA")
        # Resize if either dimension is excessively large
        if max(img.size) > MAX_IMAGE_DIM:
            img.thumbnail((MAX_IMAGE_DIM, MAX_IMAGE_DIM), Image.LANCZOS)
        img.save(dest, format="WEBP", quality=WEBP_QUALITY)
        return True
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Strategy 1 – Direct LTS product page scrape
# ---------------------------------------------------------------------------

LTS_PRODUCT_BASE = "https://www.ltsecurityinc.com/products/"
LTS_CDN_PATTERN = re.compile(
    r"https?://[^\s\"']+(?:cdn|ltsecurityinc)[^\s\"']*\.(?:jpg|jpeg|png|webp)",
    re.IGNORECASE,
)


def try_lts_product_page(sku: str) -> bytes | None:
    """
    Attempt to find the product image on the LTS website.
    Tries several common URL patterns for LTS product pages.
    """
    # Build a list of candidate URLs (LTS uses various path schemes)
    slug = sku.lower().replace(" ", "-")
    candidates = [
        f"{LTS_PRODUCT_BASE}{slug}",
        f"{LTS_PRODUCT_BASE}{slug}.html",
        f"https://www.ltsecurityinc.com/{slug}",
        f"https://www.ltsecurityinc.com/products/{slug}/",
    ]

    for url in candidates:
        try:
            resp = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
            if resp.status_code != 200:
                continue
            if "text/html" not in resp.headers.get("Content-Type", ""):
                continue

            soup = BeautifulSoup(resp.text, "html.parser")

            # Collect image URLs from various sources in the page
            image_urls: list[str] = []

            # <img> tags with alt text containing the SKU
            for img_tag in soup.find_all("img", src=True):
                src = img_tag["src"].strip()
                alt = (img_tag.get("alt") or "").lower()
                if is_valid_image_url(src):
                    # Prefer images whose alt text mentions the SKU
                    if sku.lower() in alt or "product" in alt or "main" in alt:
                        image_urls.insert(0, src)
                    else:
                        image_urls.append(src)

            # og:image meta tag (often the main product image)
            og = soup.find("meta", property="og:image")
            if og and og.get("content"):
                image_urls.insert(0, og["content"].strip())

            # Also grab background-image URLs from inline styles
            for div in soup.find_all(style=True):
                style = div.get("style", "")
                matches = re.findall(r"url\(['\"]?([^'\")]+)['\"]?\)", style)
                for m in matches:
                    if is_valid_image_url(m):
                        image_urls.append(m)

            # Deduplicate while preserving order
            seen = set()
            unique_urls = []
            for u in image_urls:
                # Make relative URLs absolute
                abs_url = urllib.parse.urljoin(url, u)
                if abs_url not in seen:
                    seen.add(abs_url)
                    unique_urls.append(abs_url)

            # Try each image URL
            for img_url in unique_urls:
                data = download_image_bytes(img_url)
                if data:
                    return data

        except requests.RequestException:
            continue

    return None


# ---------------------------------------------------------------------------
# Strategy 2 – DuckDuckGo image search fallback
# ---------------------------------------------------------------------------

DDG_IMAGE_SEARCH = "https://duckduckgo.com/"


def try_duckduckgo_search(sku: str) -> bytes | None:
    """
    Search DuckDuckGo Images for the SKU + 'LT Security' and return the
    first good-looking result as raw bytes.
    """
    query = f"{sku} LT Security camera"

    # Step 1: Get a vqd token (DuckDuckGo requires it for the AJAX endpoint)
    try:
        resp = session.get(
            DDG_IMAGE_SEARCH,
            params={"q": query},
            timeout=REQUEST_TIMEOUT,
        )
        vqd_match = re.search(r'vqd=["\']([^"\']+)', resp.text)
        if not vqd_match:
            # Fallback: try extracting from a different pattern
            vqd_match = re.search(r"vqd=([\d-]+)", resp.text)
        if not vqd_match:
            return None
        vqd = vqd_match.group(1)
    except requests.RequestException:
        return None

    # Step 2: Query the image results endpoint
    api_url = "https://duckduckgo.com/i.js"
    params = {
        "l": "wt-jhG",
        "q": query,
        "vqd": vqd,
        "f": ",,,",
        "p": "1",
    }
    headers = {
        **HEADERS,
        "Referer": "https://duckduckgo.com/",
    }

    try:
        resp = session.get(api_url, params=params, headers=headers, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()
        results = data.get("results", [])
    except (requests.RequestException, ValueError):
        results = []

    for result in results:
        img_url = result.get("image") or result.get("thumbnail")
        if not img_url:
            continue
        image_data = download_image_bytes(img_url)
        if image_data:
            return image_data

    return None


# ---------------------------------------------------------------------------
# Strategy 3 – Generic Google image search via HTML scraping (fallback #2)
# ---------------------------------------------------------------------------

def try_google_search(sku: str) -> bytes | None:
    """
    Last-resort: scrape Google image search HTML for the SKU.
    This is fragile but works without an API key for light usage.
    """
    query = f"{sku} LT Security product image"
    url = "https://www.google.com/search"
    params = {
        "q": query,
        "tbm": "isch",  # image search
        "hl": "en",
    }
    headers = {
        **HEADERS,
        "Referer": "https://www.google.com/",
    }

    try:
        resp = session.get(url, params=params, headers=headers, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()

        # Google embeds image URLs in the HTML in various ways
        # Look for img src attributes and data-src attributes
        soup = BeautifulSoup(resp.text, "html.parser")

        image_urls: list[str] = []
        for img_tag in soup.find_all("img"):
            src = img_tag.get("src") or img_tag.get("data-src") or ""
            if src.startswith("http") and "gstatic" not in src and "google" not in src:
                image_urls.append(src)

        # Also try to extract from script data (Google sometimes embeds JSON)
        script_matches = re.findall(r'"(https?://[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"', resp.text)
        for match in script_matches:
            if "gstatic" not in match and "google" not in match:
                image_urls.append(match)

        for img_url in image_urls[:10]:
            image_data = download_image_bytes(img_url)
            if image_data:
                return image_data

    except requests.RequestException:
        pass

    return None


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def process_sku(sku: str) -> bool:
    """Try all strategies to download and save the product image for a SKU."""
    dest = OUTPUT_DIR / f"{sku}.webp"

    # Skip if already downloaded in a previous run
    if dest.exists() and dest.stat().st_size > MIN_IMAGE_SIZE:
        print(f"  [SKIP] {sku} – image already exists")
        return True

    print(f"  [ .. ] {sku} – searching …", end="", flush=True)

    image_data: bytes | None = None
    source: str = ""

    # Try each strategy in order of reliability
    strategies = [
        ("LTS website", try_lts_product_page),
        ("DuckDuckGo", try_duckduckgo_search),
        ("Google Images", try_google_search),
    ]

    for name, strategy_fn in strategies:
        try:
            image_data = strategy_fn(sku)
            if image_data:
                source = name
                break
        except Exception:
            continue

    if not image_data:
        print(f" \r  [FAIL] {sku} – no image found")
        return False

    # Save as WebP
    if save_as_webp(image_data, dest):
        size_kb = dest.stat().st_size / 1024
        print(f" \r  [ OK ] {sku} – saved via {source} ({size_kb:.1f} KB)")
        return True
    else:
        print(f" \r  [FAIL] {sku} – WebP conversion error")
        return False


def main():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: '{INPUT_FILE}' not found.", file=sys.stderr)
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    skus = read_skus(INPUT_FILE)
    if not skus:
        print("No SKUs found in input file.", file=sys.stderr)
        sys.exit(1)

    print(f"Processing {len(skus)} SKU(s) …\n")

    success = 0
    failed = 0

    for i, sku in enumerate(skus, 1):
        print(f"[{i}/{len(skus)}]", end="")
        if process_sku(sku):
            success += 1
        else:
            failed += 1
        # Be polite: wait between requests
        if i < len(skus):
            time.sleep(DELAY_BETWEEN_REQUESTS)

    print(f"\nDone. {success} succeeded, {failed} failed out of {len(skus)} SKU(s).")

    if failed > 0:
        # Write a list of still-missing SKUs for easy retry
        retry_file = Path("missing_images_skus_retry.txt")
        with open(retry_file, "w", encoding="utf-8") as f:
            for sku in skus:
                dest = OUTPUT_DIR / f"{sku}.webp"
                if not dest.exists() or dest.stat().st_size <= MIN_IMAGE_SIZE:
                    f.write(sku + "\n")
        print(f"Retry list written to {retry_file}")


if __name__ == "__main__":
    main()
