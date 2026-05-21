import json
import re
from pypdf import PdfReader

def extract_prices(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    matches = re.findall(r"([A-Z0-9-]{5,20})\s+.*?(\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)", text)
    prices = {}
    for m in matches:
        sku = re.sub(r'[^a-zA-Z0-9]', '', m[0]).upper()
        price_str = m[1].replace('$', '').replace(',', '')
        try:
            prices[sku] = float(price_str)
        except:
            pass
    return prices

p1 = extract_prices('lts-catalog-tool/data/2025 Q4 LTS Catalog_Pricing.pdf')
p2 = extract_prices('lts-catalog-tool/data/2025 Q4 LTS Pro-X Catalog_Pricing.pdf')

prices = {**p1, **p2}
print('LTN8708D-P8N price:', prices.get('LTN8708DP8N'))
print('LTK6128WWIFI price:', prices.get('LTK6128WWIFI'))
print('Total prices found:', len(prices))
