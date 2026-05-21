#!/usr/bin/env python3
"""
catalog_gap_finder.py
──────────────────────────────────────────────────────────
Cross-reference LTS / Pro-X catalog text files against an
existing-SKU list and report every product that still needs
to be added to the website.
"""

import csv
import re
import sys
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Dict, List, Set

# ─── Configuration ────────────────────────────────────────────────
BASE_DIR = Path("lts-catalog-tool/data")
CATALOG_FILES = [
    BASE_DIR / "catalog_text.txt",
    BASE_DIR / "prox_catalog_text.txt",
]
EXISTING_SKUS_FILE = Path("existing_skus.txt")
OUTPUT_FILE = Path("missing_products.csv")

# Delimiters tried in order when auto-detecting each line
FIELD_DELIMITERS = ["|", "\t", ","]
# Prefixes for valid LTS and Pro-X products
VALID_PREFIXES = [
    "CMIP", "LTN", "LTA", "LTD", "LTP", "LTT", "LTV", "LTC", "LTM", "LTS", "LTK", "LTCM",
    "LXIP", "LXN", "XCPOE", "LXK", "LXA", "LXPTZ"
]

# Words that indicate a line is junk and not a product row
BLACKLIST = {
    "ALL-IN-ONE", "ANTI-CORROSION", "HIGH-QUALITY", "VALUE-ADDED", "END-TO-END",
    "MULTI-DOOR", "REAL-TIME", "USER-FRIENDLY", "CLOUD-BASED", "END-USERS",
    "CO-BRANDING", "MULTI-SENSOR", "LIVE VIEW", "PANORAMIC", "LOW-LIGHT",
    "STB-LIGHT", "AUTO WDR", "MAX. RESOLUTION", "MIN. ILLUMINATION", "SPECIAL FEATURES",
    "PROTECTION", "POWER", "LENS", "VCA", "HUMAN/VEHICLE", "DETECTION", "DIRECT-SEARCH",
    "FACE CAPTURE", "COMING SOON", "PRICE", "HOUSTON", "MIAMI", "CHICAGO", "TX", "FL", "IL"
}

SKU_PATTERN = re.compile(
    r"\b((?:" + "|".join(VALID_PREFIXES) + r")[A-Z0-9\-]{3,})\b", 
    re.IGNORECASE
)


# ─── Data model ───────────────────────────────────────────────────
@dataclass
class Product:
    sku: str
    name: str
    price: str
    category: str
    source: str  # which catalog file the row came from


# ─── Helpers ──────────────────────────────────────────────────────
def normalise_sku(raw: str) -> str:
    """Strip whitespace and upper-case for consistent comparison."""
    return raw.strip().upper().replace("*", "")


def is_valid_sku(sku: str) -> bool:
    """Check if a SKU looks legitimate and isn't in the blacklist."""
    sku_upper = sku.upper()
    if any(blacklisted in sku_upper for blacklisted in BLACKLIST):
        return False
    # Must start with one of our prefixes
    if not any(sku_upper.startswith(p) for p in VALID_PREFIXES):
        return False
    # Basic length check
    if len(sku_upper) < 5:
        return False
    return True


def load_existing_skus(path: Path) -> Set[str]:
    """
    Read the existing-SKU file. Handles one-per-line **or**
    comma-separated values. Blank lines are skipped.
    """
    skus: Set[str] = set()
    if not path.exists():
        print(f"[WARN] Existing-SKU file not found: {path}")
        return skus

    with open(path, "r", encoding="utf-8") as fh:
        for line in fh:
            for token in line.split(","):
                token = token.strip()
                if token:
                    skus.add(normalise_sku(token))
    return skus


def _detect_delimiter(line: str) -> str:
    """Return the first delimiter that splits a line into ≥ 3 fields."""
    for delim in FIELD_DELIMITERS:
        if len(line.split(delim)) >= 3:
            return delim
    return "|"


def _parse_price(raw: str) -> str:
    """Clean up a price string; return empty string if not parseable."""
    raw = raw.strip()
    if not raw or raw.lower() in {"n/a", "na", "-", "—", "–", ""}:
        return ""
    # Keep common price formats (e.g. $12.99, 12.99)
    return raw


def parse_catalog(path: Path) -> Dict[str, Product]:
    """
    Parse a catalog text file into a dict keyed by normalised SKU.
    """
    products: Dict[str, Product] = {}
    if not path.exists():
        print(f"[WARN] Catalog file not found: {path}")
        return products

    source_name = path.name
    header_keywords = {"sku", "product", "name", "price", "category", "description"}
    header_seen = False

    with open(path, "r", encoding="utf-8") as fh:
        for line_num, line in enumerate(fh, start=1):
            line = line.rstrip("\n\r")
            if not line.strip():
                continue

            # Skip an initial header row (heuristic)
            if not header_seen:
                lower_line = line.lower()
                if any(kw in lower_line for kw in header_keywords) and line_num <= 3:
                    header_seen = True
                    continue
                header_seen = True  # first data line acts as flag

            delim = _detect_delimiter(line)
            parts = [p.strip() for p in line.split(delim)]

            if len(parts) < 2:
                # Possibly a free-form line; try regex SKU extraction
                matches = SKU_PATTERN.findall(line)
                if not matches:
                    continue
                
                # Take the first valid SKU found in the line
                valid_found = False
                for sku_candidate in matches:
                    if is_valid_sku(sku_candidate):
                        sku_raw = sku_candidate
                        name_raw = line.replace(sku_raw, "").strip()
                        parts = [sku_raw, name_raw, "", ""]
                        valid_found = True
                        break
                
                if not valid_found:
                    continue

            # Ensure we always have 4 elements
            while len(parts) < 4:
                parts.append("")

            sku_raw, name_raw, price_raw, cat_raw = parts[:4]

            # Validate SKU doesn't look like a price or junk
            sku_clean = sku_raw.strip().replace("*", "")
            if not is_valid_sku(sku_clean):
                continue

            sku_norm = normalise_sku(sku_clean)

            if sku_norm in products:
                continue

            products[sku_norm] = Product(
                sku=sku_clean,
                name=name_raw.strip(),
                price=_parse_price(price_raw),
                category=cat_raw.strip(),
                source=source_name,
            )

    print(f"  Parsed {len(products)} unique SKUs from {path.name}")
    return products


# ─── Main logic ───────────────────────────────────────────────────
def find_missing_products() -> List[Product]:
    """Return products present in the catalogs but absent from the website."""
    existing = load_existing_skus(EXISTING_SKUS_FILE)
    print(f"\n[INFO] Loaded {len(existing)} existing SKUs from {EXISTING_SKUS_FILE}")

    all_catalog: Dict[str, Product] = {}
    for catalog_path in CATALOG_FILES:
        catalog_products = parse_catalog(catalog_path)
        for sku, prod in catalog_products.items():
            if sku not in all_catalog:
                all_catalog[sku] = prod

    print(f"\n[INFO] Total unique catalog SKUs: {len(all_catalog)}")

    missing = [
        prod for sku, prod in all_catalog.items() if sku not in existing
    ]
    print(f"[INFO] Missing from website: {len(missing)} SKU(s)\n")
    return missing


def write_report(missing: List[Product], output_path: Path) -> None:
    """Write the missing-product list to a CSV file."""
    fieldnames = ["sku", "name", "price", "category", "source"]
    with open(output_path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for prod in missing:
            writer.writerow(asdict(prod))
    print(f"[DONE] Report written to {output_path}  ({len(missing)} rows)")


if __name__ == "__main__":
    missing_products = find_missing_products()
    write_report(missing_products, OUTPUT_FILE)
