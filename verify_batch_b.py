import re
import os

# Base directory
base_dir = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final"
products_js_path = os.path.join(base_dir, "products.js")

# SKUs to check (Batch B candidates)
skus_to_check = [
    "CMIP7283W-SDZ",
    "CMIP7C42WI-28MDA",
    "CMIP7C43WI-SDLQ",
    "CMIP7C82WI-28MDA",
    "CMIP8C42WI-28MDA",
    "CMIP9783W-SDZ",
    "CMIP9C42WI-28MD",
    "CMIP9C8PW-SDL",
    "LTAC2032B-CMX",
    "LTSecurityinc",
    "LXIP3542WE-28MDA",
    "LXIP3582WE-28MDA"
]

with open(products_js_path, "r") as f:
    content = f.read()

missing_b = []
for sku in skus_to_check:
    # Check for direct SKU, LT prefixed SKU, and lowercase versions
    patterns = [
        sku,
        f"LT{sku}",
        sku.lower(),
        f"LT{sku}".lower()
    ]
    found = False
    for p in patterns:
        if p in content:
            found = True
            break
    if not found:
        missing_b.append(sku)

print("Actually missing for Batch B:")
for sku in missing_b:
    print(sku)
