import json
import os

products_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/products.js'
missing_skus_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/truly_missing_skus.txt'

new_products = [
  {
    "series_id": "CMIP1043W-MDZ",
    "name": "Platinum 4 MP Varifocal Turret Network Camera",
    "description": "4MP Outdoor Turret IP Camera with motorized varifocal lens and AI-driven human/vehicle detection.",
    "long_description": "The LTS CMIP1043W-MDZ is a Platinum Series 4MP outdoor turret IP camera featuring a 2.8 to 12mm motorized varifocal lens, AI-driven human and vehicle detection, 120 dB WDR, and H.265+ compression. Rated IP67 for harsh outdoor environments.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip1043w-mdz_1.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["4MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP1043W-MDZ",
        "name": "Platinum 4 MP Varifocal Turret Network Camera",
        "description": "4MP Outdoor Turret IP Camera with motorized varifocal lens and AI-driven human/vehicle detection.",
        "price": 270.60
      }
    ],
    "specs": {
      "Resolution": "4MP",
      "Sensor": "1/3\" CMOS",
      "Lens": "2.8-12mm Motorized Varifocal",
      "IR Distance": "98 ft",
      "WDR": "120 dB",
      "Compression": "H.265+",
      "Weatherproof": "IP67"
    }
  },
  {
    "series_id": "CMIP3162W-28SDA",
    "name": "Platinum 6 MP Smart Fixed Mini Dome IP Camera",
    "description": "6MP Smart Fixed Mini Dome IP Camera with 120 dB WDR and built-in microphone. Discontinued.",
    "long_description": "The LTS CMIP3162W-28SDA is a Platinum Series 6MP smart fixed mini dome IP camera featuring a 1/2.4\" CMOS sensor, 120 dB WDR, built-in microphone, IP67 weatherproof rating, and IK08 vandal-resistant housing. This product has been discontinued.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3162w-28sda.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "DOME"],
      "camera_resolution": ["6MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3162W-28SDA",
        "name": "Platinum 6 MP Smart Fixed Mini Dome IP Camera",
        "description": "6MP Smart Fixed Mini Dome IP Camera with 120 dB WDR and built-in microphone. Discontinued.",
        "price": 185.00
      }
    ],
    "specs": {
      "Resolution": "6MP",
      "Sensor": "1/2.4\" CMOS",
      "Lens": "2.8mm Fixed",
      "IR Distance": "98 ft",
      "WDR": "120 dB",
      "Audio": "Built-in Microphone",
      "Weatherproof": "IP67",
      "Vandal Resistance": "IK08"
    }
  },
  {
    "series_id": "CMIP3342WI-28SDL",
    "name": "Platinum 4MP Active Deterrence Turret Network Camera",
    "description": "4MP Active Deterrence Turret with strobe light, audio alarm, and Smart Hybrid Light.",
    "long_description": "The LTS Platinum Series 4MP Active Deterrence Turret Network Camera features a strobe light and audio alarm for active deterrence, Smart Hybrid Light technology, and a dual-array microphone for audio recording. Available in white and black housing options.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3342wi-28sdl.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["4MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3342WI-28SDL",
        "name": "Platinum 4MP Active Deterrence Turret Network Camera - White",
        "description": "4MP Active Deterrence Turret with strobe light, audio alarm, and Smart Hybrid Light.",
        "price": 189.00
      },
      {
        "sku": "CMIP3342WIB-28SDL",
        "name": "Platinum 4MP Active Deterrence Turret Network Camera - Black",
        "description": "4MP Active Deterrence Turret with strobe light, audio alarm, and Smart Hybrid Light. Black housing.",
        "price": 189.00
      }
    ],
    "specs": {
      "Resolution": "4MP",
      "Lens": "2.8mm Fixed",
      "Lighting": "Smart Hybrid Light",
      "Deterrence": "Strobe Light & Audio Alarm",
      "Audio": "Dual-Array Microphone"
    }
  },
  {
    "series_id": "CMIP3382WIB-28SDL",
    "name": "Platinum 8MP Active Deterrence Turret Network Camera",
    "description": "8MP (4K) Active Deterrence Turret with strobe light, audio alarm, and hybrid light. Black housing.",
    "long_description": "The LTS CMIP3382WIB-28SDL is a Platinum Series 8MP (4K) active deterrence turret network camera in black. It features a strobe light and audio alarm for active deterrence, Smart Hybrid Light technology, and a 2.8mm fixed lens for wide-angle coverage.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3342wi-28sdl.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["8MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3382WIB-28SDL",
        "name": "Platinum 8MP Active Deterrence Turret Network Camera - Black",
        "description": "8MP (4K) Active Deterrence Turret with strobe light, audio alarm, and hybrid light.",
        "price": 235.00
      }
    ],
    "specs": {
      "Resolution": "8MP (4K)",
      "Lens": "2.8mm Fixed",
      "Lighting": "Smart Hybrid Light",
      "Deterrence": "Strobe Light & Audio Alarm"
    }
  },
  {
    "series_id": "CMIP3743W2-DLZ",
    "name": "Platinum 4 MP Dual-lens Fixed Point Zoom Turret Network Camera",
    "description": "4MP Dual-lens turret with point-to-point zoom, active deterrence, and dual-microphone. NEMA 4X rated.",
    "long_description": "The LTS CMIP3743W2-DLZ is a Platinum Series 4MP dual-lens fixed point zoom turret network camera featuring dual 2.8mm and 4mm lenses for point-to-point zoom capability, active deterrence, dual-microphone audio, and a rugged NEMA 4X enclosure for harsh environments.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3743w2-dlz.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["4MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3743W2-DLZ",
        "name": "Platinum 4 MP Dual-lens Fixed Point Zoom Turret Network Camera",
        "description": "4MP Dual-lens turret with point-to-point zoom, active deterrence, and dual-microphone.",
        "price": 369.00
      }
    ],
    "specs": {
      "Resolution": "4MP Dual-Channel",
      "Lenses": "2.8mm + 4mm Dual-Lens",
      "Zoom": "Point-to-Point Zoom",
      "Deterrence": "Active Deterrence",
      "Audio": "Dual Microphone",
      "Enclosure": "NEMA 4X"
    }
  },
  {
    "series_id": "CMIP384PW-28SDL",
    "name": "Platinum 4 MP Panoramic Turret IP Camera",
    "description": "4MP Panoramic Turret with 180° FOV, dual sensors, and 120 dB WDR.",
    "long_description": "The LTS CMIP384PW-28SDL is a Platinum Series 4MP panoramic turret IP camera featuring dual sensors for a 180° field of view, 120 dB WDR for challenging lighting conditions, and a resolution of 5120x1440 for wide-area surveillance coverage.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip384pw-28sdl.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET", "PANORAMIC"],
      "camera_resolution": ["4MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP384PW-28SDL",
        "name": "Platinum 4 MP Panoramic Turret IP Camera",
        "description": "4MP Panoramic Turret with 180° FOV, dual sensors, and 120 dB WDR.",
        "price": 234.38
      }
    ],
    "specs": {
      "Resolution": "4MP (5120x1440)",
      "FOV": "180°",
      "Sensors": "Dual Sensor",
      "WDR": "120 dB"
    }
  },
  {
    "series_id": "CMIP398PW-2SDL",
    "name": "Platinum 8MP Panoramic Active Deterrence Turret Network Camera",
    "description": "8MP 180° Panoramic Active Deterrence Turret with strobe/audio alarm and hybrid light.",
    "long_description": "The LTS CMIP398PW-2SDL is a Platinum Series 8MP panoramic active deterrence turret network camera featuring a 180° field of view with 5120x2160 resolution, strobe light and audio alarm for active deterrence, and Smart Hybrid Light technology for comprehensive wide-area surveillance.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip398pw-2sdl.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET", "PANORAMIC"],
      "camera_resolution": ["8MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP398PW-2SDL",
        "name": "Platinum 8MP Panoramic Active Deterrence Turret Network Camera",
        "description": "8MP 180° Panoramic Active Deterrence Turret with strobe/audio alarm and hybrid light.",
        "price": 329.00
      }
    ],
    "specs": {
      "Resolution": "8MP (5120x2160)",
      "FOV": "180°",
      "Deterrence": "Strobe Light & Audio Alarm",
      "Lighting": "Smart Hybrid Light"
    }
  },
  {
    "series_id": "CMIP3C42NWB-28MDA",
    "name": "Platinum 4 MP Color 24/7 Fixed Turret IP Camera - Black",
    "description": "4MP Color 24/7 turret with F1.0 lens, 130 dB WDR, and built-in microphone. Discontinued.",
    "long_description": "The LTS CMIP3C42NWB-28MDA is a Platinum Series 4MP Color 24/7 fixed turret IP camera in black. It features a 1/1.8\" CMOS sensor for full-color 24/7 imaging, an F1.0 large-aperture lens, 130 dB WDR, and a built-in microphone. This product has been discontinued.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3c42nwb-28mda.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["4MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3C42NWB-28MDA",
        "name": "Platinum 4 MP Color 24/7 Fixed Turret IP Camera - Black",
        "description": "4MP Color 24/7 turret with F1.0 lens, 130 dB WDR, and built-in microphone. Discontinued.",
        "price": 229.00
      }
    ],
    "specs": {
      "Resolution": "4MP",
      "Sensor": "1/1.8\" CMOS (Color 24/7)",
      "Lens": "2.8mm F1.0",
      "WDR": "130 dB",
      "Audio": "Built-in Microphone",
      "Color Technology": "24/7 Full Color"
    }
  },
  {
    "series_id": "CMIP3C42WI-28SDL",
    "name": "Platinum 4 MP Color 24/7 Turret IP Camera",
    "description": "4MP Color 24/7 turret with smart hybrid lighting and 130 dB WDR.",
    "long_description": "The LTS CMIP3C42WI-28SDL is a Platinum Series 4MP Color 24/7 turret IP camera featuring full-color 24/7 imaging, Smart Hybrid Light technology for supplemental illumination, and 130 dB WDR for superior performance in challenging lighting conditions.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3c42wi-28sdl.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["4MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3C42WI-28SDL",
        "name": "Platinum 4 MP Color 24/7 Turret IP Camera",
        "description": "4MP Color 24/7 turret with smart hybrid lighting and 130 dB WDR.",
        "price": 239.00
      }
    ],
    "specs": {
      "Resolution": "4MP",
      "Lighting": "Smart Hybrid Light (Color 24/7)",
      "WDR": "130 dB",
      "Color Technology": "24/7 Full Color"
    }
  }
]

with open(products_file, 'r') as f:
    content = f.read()

# Find the end of the array
insert_pos = content.rfind('];')
if insert_pos != -1:
    formatted_json = json.dumps(new_products, indent=2)[1:-1].strip()
    new_content = content[:insert_pos] + ",\n  " + formatted_json + "\n" + content[insert_pos:]
    with open(products_file, 'w') as f:
        f.write(new_content)
    print(f"Successfully added {len(new_products)} products to products.js")
else:
    print("Could not find the end of the products array in products.js")

# Remove from missing SKUs
processed_skus = [
    "CMIP1043W-MDZ", "CMIP3162W-28SDA", "CMIP3342WI-28SDL", "CMIP3342WIB-28SDL",
    "CMIP3382WIB-28SDL", "CMIP3743W2-DLZ", "CMIP384PW-28SDL", "CMIP398PW-2SDL",
    "CMIP3C42NWB-28MDA", "CMIP3C42WI-28SDL"
]

if os.path.exists(missing_skus_file):
    with open(missing_skus_file, 'r') as f:
        lines = f.readlines()
    new_lines = [line for line in lines if line.strip() not in processed_skus]
    with open(missing_skus_file, 'w') as f:
        f.writelines(new_lines)
    print(f"Removed {len(processed_skus)} SKUs from truly_missing_skus.txt")
