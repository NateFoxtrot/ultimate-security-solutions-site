import json
import os

products_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/products.js'

new_products = [
  {
    "series_id": "LXIP3542WE-28MDA",
    "name": "LTS 4MP Starlight IP Camera with Built-in Mic & MD 2.0 (2.8mm)",
    "description": "4MP IP turret camera featuring Starlight technology, Matrix IR illumination up to 98ft, Motion Detection 2.0 (Human/Vehicle), built-in microphone, MicroSD card slot (up to 256GB), IP67 weather-rated housing, and 120dB WDR.",
    "long_description": "The LTS LXIP3542WE-28MDA is a high-performance 4-megapixel IP network turret camera from the Pro-X series, designed for reliable 24/7 surveillance. Powered by Starlight technology, it delivers exceptional low-light performance down to 0.005 Lux, ensuring clear, full-color imagery in near-darkness. Equipped with a fixed 2.8mm wide-angle lens, the camera provides an expansive field of view ideal for monitoring broad areas such as retail stores, offices, and residential perimeters. Matrix IR technology provides up to 98 feet of uniform infrared illumination for complete darkness conditions. The built-in intelligent Motion Detection 2.0 algorithm accurately classifies human and vehicle targets, significantly reducing false alarms and enabling more efficient event response. A built-in microphone captures ambient audio for enhanced situational awareness. On-board storage via MicroSD card (up to 256GB) enables edge recording for standalone or backup operation. The camera's IP67-rated housing ensures robust protection against dust and water, while 120dB true WDR technology balances high-contrast scenes for clear, usable footage in challenging lighting. The 'E' designation denotes the international/export variant of the LXIP3542W-28MDA.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/l/x/lxip3542w-28mda.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["4MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PRO-X SERIES"]
    },
    "variants": [
      {
        "sku": "LXIP3542WE-28MDA",
        "name": "LTS 4MP Starlight IP Camera - 2.8mm Lens, Built-in Mic, MD 2.0 (Export/International)",
        "description": "4MP Starlight IP turret camera, 2.8mm fixed lens, Matrix IR 98ft, MD 2.0 Human/Vehicle, Built-in Mic, MicroSD 256GB, IP67, 120dB WDR. International/export variant.",
        "price": 149.00
      }
    ],
    "specs": {
      "Resolution": "4 Megapixel (2688 x 1520)",
      "Sensor": "1/1.8\" CMOS Starlight (0.005 Lux min. illumination)",
      "Lens": "2.8mm fixed focal length, wide-angle",
      "IR Range": "Up to 98 ft (30m) Matrix IR",
      "WDR": "120dB True WDR",
      "Audio": "Built-in microphone",
      "Storage": "MicroSD card slot, up to 256GB",
      "Intelligence": "Motion Detection 2.0 (Human & Vehicle classification)",
      "Protection": "IP67 (dust and waterproof)",
      "Power": "PoE (802.3af)",
      "Compression": "H.265+ / H.265 / H.264+ / H.264"
    }
  },
  {
    "series_id": "LXIP3582WE-28MDA",
    "name": "LTS 8MP/4K Starlight IP Camera with Built-in Mic & MD 2.0 (2.8mm)",
    "description": "8MP/4K IP turret camera featuring Starlight technology, Matrix IR illumination up to 98ft, Motion Detection 2.0 (Human/Vehicle), built-in microphone, MicroSD card slot (up to 256GB), IP67 weather-rated housing, and 120dB WDR.",
    "long_description": "The LTS LXIP3582WE-28MDA is a premium 8-megapixel (4K) IP network turret camera from the Pro-X series, engineered for ultra-high-definition surveillance in demanding environments. Leveraging advanced Starlight technology with a minimum illumination of 0.005 Lux, it captures vivid, full-color detail even in extremely low-light conditions—well before switching to infrared mode. The fixed 2.8mm wide-angle lens delivers a generous field of view, making it suitable for applications requiring broad coverage with 4K clarity, such as commercial facades, parking lots, building entrances, and large retail spaces. Matrix IR technology provides up to 98 feet of even infrared illumination for pitch-dark environments. Intelligent Motion Detection 2.0 leverages deep learning to differentiate between human and vehicle targets, minimizing nuisance alerts from animals, foliage, or weather. The integrated microphone provides real-time audio monitoring for comprehensive situational awareness. Edge recording via MicroSD card (up to 256GB) supports standalone operation or serves as a reliable backup to NVR recording. The IP67-rated enclosure guarantees durability against harsh outdoor conditions, and 120dB true WDR ensures balanced exposure in high-contrast scenes. The 'E' designation denotes the international/export variant of the LXIP3582W-28MDA.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/l/x/lxip3582w-28mda.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["8MP", "4K"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PRO-X SERIES"]
    },
    "variants": [
      {
        "sku": "LXIP3582WE-28MDA",
        "name": "LTS 8MP/4K Starlight IP Camera - 2.8mm Lens, Built-in Mic, MD 2.0 (Export/International)",
        "description": "8MP/4K Starlight IP turret camera, 2.8mm fixed lens, Matrix IR 98ft, MD 2.0 Human/Vehicle, Built-in Mic, MicroSD 256GB, IP67, 120dB WDR. International/export variant.",
        "price": 199.00
      }
    ],
    "specs": {
      "Resolution": "8 Megapixel / 4K (3840 x 2160)",
      "Sensor": "1/1.8\" CMOS Starlight (0.005 Lux min. illumination)",
      "Lens": "2.8mm fixed focal length, wide-angle",
      "IR Range": "Up to 98 ft (30m) Matrix IR",
      "WDR": "120dB True WDR",
      "Audio": "Built-in microphone",
      "Storage": "MicroSD card slot, up to 256GB",
      "Intelligence": "Motion Detection 2.0 (Human & Vehicle classification)",
      "Protection": "IP67 (dust and waterproof)",
      "Power": "PoE (802.3af)",
      "Compression": "H.265+ / H.265 / H.264+ / H.264"
    }
  },
  {
    "series_id": "LTAC2032B-CMX",
    "name": "LTS 2MP TVI Analog Bullet Camera with EXIR IR",
    "description": "2MP HD-TVI analog bullet camera with EXIR IR illumination up to 80ft, 3.6mm fixed lens, IP66 weather-rated housing, and OSD via coaxial cable.",
    "long_description": "The LTS AC-series cameras are part of the analog/TVI product line, offering high-definition video over standard coaxial cabling for cost-effective surveillance upgrades. This 2-megapixel bullet camera delivers 1080p resolution footage with EXIR 2.0 infrared technology, providing up to 80 feet of clear night vision illumination with a more uniform beam pattern than conventional IR. The 3.6mm fixed lens offers a balanced field of view for general-purpose monitoring. On-Screen Display (OSD) menus accessible via coaxial cable allow for in-field configuration adjustments. The IP66-rated metal housing provides reliable protection against dust, rain, and snow for outdoor deployment.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/l/t/ltac2032b.jpg",
    "facets": {
      "category": ["TVI SOLUTIONS", "BULLET"],
      "camera_resolution": ["2MP"],
      "camera_technology": ["ANALOG", "TVI"],
      "camera_series": ["AC SERIES"]
    },
    "variants": [
      {
        "sku": "LTAC2032B-CMX",
        "name": "LTS 2MP TVI Bullet Camera - 3.6mm Lens, EXIR IR 80ft, IP66",
        "description": "2MP HD-TVI analog bullet camera, 3.6mm fixed lens, EXIR IR up to 80ft, IP66, OSD via coax.",
        "price": 59.00
      }
    ],
    "specs": {
      "Resolution": "2 Megapixel (1920 x 1080)",
      "Sensor": "1/2.9\" CMOS",
      "Lens": "3.6mm fixed focal length",
      "IR Range": "Up to 80 ft (25m) EXIR 2.0",
      "WDR": "Digital WDR",
      "Audio": "None",
      "Protection": "IP66 (dust and rain resistant)",
      "Power": "12V DC",
      "Video Output": "HD-TVI / CVI / AHD / CVBS"
    }
  }
]

with open(products_file, 'r') as f:
    content = f.read()

insert_pos = content.rfind('];')
if insert_pos != -1:
    formatted_json = json.dumps(new_products, indent=2)[1:-1].strip()
    prefix = ",\n  "
    new_content = content[:insert_pos] + prefix + formatted_json + "\n" + content[insert_pos:]
    with open(products_file, 'w') as f:
        f.write(new_content)
    print(f"Successfully added {len(new_products)} products to products.js")
else:
    print("Could not find the end of the products array in products.js")

# Update tracking files
skus_to_remove = [
    "CMIP1382NW-28MA", "CMIP1382WE-28MDA", "CMIP1C42W-28MDA", "CMIP1C42WB-28MDA",
    "CMIP3182W-28SDA", "CMIP3283W-SDZ", "CMIP3382WI-28SDL", "CMIP3C42WI-MDA",
    "CMIP3C82WI-28MDA", "CMIP3C82WIB-28MDA", "CMIP3C8PW-SDL", "CMIP7112F-SE",
    "CMIP7283W-SDZ", "CMIP7C42WI-28MDA", "CMIP7C43WI-SDLQ", "CMIP7C82WI-28MDA",
    "CMIP8C42WI-28MDA", "CMIP9783W-SDZ", "CMIP9C42WI-28MD", "CMIP9C8PW-SDL",
    "LTAC2032B-CMX", "LTSecurityinc", "LXIP3542WE-28MDA", "LXIP3582WE-28MDA"
]

def update_tracking_file(filepath, skus):
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            lines = f.readlines()
        # More robust filtering: check if SKU is in the line at all
        new_lines = []
        for line in lines:
            found = False
            for sku in skus:
                if sku in line:
                    found = True
                    break
            if not found:
                new_lines.append(line)
        
        with open(filepath, 'w') as f:
            f.writelines(new_lines)
        print(f"Updated {filepath}")

tracking_files = [
    '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/clean_missing_skus.txt',
    '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/truly_missing_skus.txt',
    '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/verified_missing_skus_from_clean.txt'
]

for tf in tracking_files:
    update_tracking_file(tf, skus_to_remove)
