import os
import glob

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    new_content = content.replace('logo_circuit.svg', 'logo_nav.jpg')
    new_content = new_content.replace('logo_new.png', 'logo.jpeg')
    
    if new_content != content:
        with open(file, 'w') as f:
            f.write(new_content)
        print(f"Updated {file}")
