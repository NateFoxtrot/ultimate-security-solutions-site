import os
import re

# Paths
products_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/products.js'
missing_skus_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/clean_missing_skus.txt'
output_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/verified_missing_skus_from_clean.txt'

# Read products.js content
with open(products_file, 'r') as f:
    products_content = f.read()

# Read missing skus
with open(missing_skus_file, 'r') as f:
    skus = [line.strip().split(' ')[0] for line in f if line.strip()]

# Filter skus that are NOT in products.js as a series_id or sku
actually_missing = []
for sku in skus:
    # Look for "series_id": "SKU" or "sku": "SKU"
    pattern = rf'"(series_id|sku)":\s*"{re.escape(sku)}"'
    if not re.search(pattern, products_content):
        actually_missing.append(sku)

# Write cleaned list
with open(output_file, 'w') as f:
    for sku in actually_missing:
        f.write(sku + '\n')

print(f"Original SKUs: {len(skus)}")
print(f"Actually missing SKUs: {len(actually_missing)}")
if actually_missing:
    print(f"First 5 missing: {actually_missing[:5]}")
print(f"Verified list written to: {output_file}")
