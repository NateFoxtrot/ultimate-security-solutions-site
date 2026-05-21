import os

# Paths
products_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/products.js'
missing_skus_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/truly_missing_skus.txt'
output_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/truly_missing_skus_cleaned.txt'

# Read products.js content
with open(products_file, 'r') as f:
    products_content = f.read()

# Read missing skus
with open(missing_skus_file, 'r') as f:
    skus = [line.strip() for line in f if line.strip()]

# Filter skus that are NOT in products.js
actually_missing = []
for sku in skus:
    if f'"{sku}"' not in products_content:
        actually_missing.append(sku)

# Write cleaned list
with open(output_file, 'w') as f:
    for sku in actually_missing:
        f.write(sku + '\n')

print(f"Original SKUs: {len(skus)}")
print(f"Actually missing SKUs: {len(actually_missing)}")
print(f"Cleaned list written to: {output_file}")
