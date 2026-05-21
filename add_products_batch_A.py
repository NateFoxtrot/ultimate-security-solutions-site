import json
import os

products_file = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/products.js'

new_products = [
  {
    "series_id": "CMIP1382NW-28MA",
    "name": "Platinum 8 MP Outdoor Turret IP Camera",
    "description": "8MP (4K) Outdoor Turret IP Camera with built-in microphone and 120 dB WDR.",
    "long_description": "The LTS CMIP1382NW-28MA is a Platinum Series 8MP (4K) outdoor turret IP camera featuring a 1/2.5\" Progressive Scan CMOS sensor, 120 dB True WDR, and built-in microphone. It provides high-resolution 3840x2160 video at 15fps and is rated IP67 for outdoor durability.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip1382nw-28ma.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["8MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP1382NW-28MA",
        "name": "Platinum 8 MP Outdoor Turret IP Camera",
        "description": "8MP (4K) Outdoor Turret IP Camera with built-in microphone.",
        "price": 250.00
      }
    ],
    "specs": {
      "Resolution": "8MP (3840x2160)",
      "Sensor": "1/2.5\" Progressive Scan CMOS",
      "Lens": "2.8mm Fixed",
      "IR Distance": "98 ft",
      "WDR": "120 dB",
      "Audio": "Built-in Microphone",
      "Protection": "IP67"
    }
  },
  {
    "series_id": "CMIP1382WE-28MDA",
    "name": "Platinum 8 MP Smart Hybrid Light Turret Camera",
    "description": "8MP Turret with Smart Hybrid Light, AI Human/Vehicle Detection, and built-in mic.",
    "long_description": "The LTS CMIP1382WE-28MDA is a Platinum Series 8MP IP turret camera featuring Smart Hybrid Light technology that automatically switches between IR and white light. It includes Motion Detection 2.0 for advanced human and vehicle classification and a built-in microphone for audio security.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip1382we-28mda.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["8MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP1382WE-28MDA",
        "name": "Platinum 8 MP Smart Hybrid Light Turret Camera",
        "description": "8MP Turret with Smart Hybrid Light and AI Analytics.",
        "price": 280.00
      }
    ],
    "specs": {
      "Resolution": "8MP (4K)",
      "Lens": "2.8mm Fixed",
      "Lighting": "Smart Hybrid Light (IR + White)",
      "AI Analytics": "MD 2.0 Human/Vehicle Detection",
      "Audio": "Built-in Microphone",
      "Protection": "IP67"
    }
  },
  {
    "series_id": "CMIP1C42W-28MDA",
    "name": "Platinum 4 MP Color 24/7 Mini Dome Camera",
    "description": "4MP Color 24/7 Mini Dome with F1.0 lens, 130 dB WDR, and vandal resistance.",
    "long_description": "The LTS CMIP1C42W-28MDA is a 4MP outdoor mini dome camera featuring Color 24/7 technology with an F1.0 super-aperture lens for vivid color images in near-darkness. It includes 130dB True WDR, AI human/vehicle classification, and IK08 vandal resistance.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip1c42w-28mda.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "DOME"],
      "camera_resolution": ["4MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP1C42W-28MDA",
        "name": "Platinum 4 MP Color 24/7 Mini Dome Camera - White",
        "description": "4MP Color 24/7 Mini Dome with white housing.",
        "price": 180.00
      },
      {
        "sku": "CMIP1C42WB-28MDA",
        "name": "Platinum 4 MP Color 24/7 Mini Dome Camera - Black",
        "description": "4MP Color 24/7 Mini Dome with black housing.",
        "price": 180.00
      }
    ],
    "specs": {
      "Resolution": "4MP (2688x1520)",
      "Lens": "2.8mm F1.0",
      "Color Tech": "Color 24/7 Full Color",
      "WDR": "130 dB",
      "AI Analytics": "Human/Vehicle Classification",
      "Protection": "IP67, IK08"
    }
  },
  {
    "series_id": "CMIP3182W-28SDA",
    "name": "Platinum 8 MP Smart Fixed Mini Dome IP Camera",
    "description": "8MP Mini Dome with AI Analytics, built-in microphone, and IK08 vandal resistance.",
    "long_description": "The LTS CMIP3182W-28SDA is a Platinum Series 8MP (4K) fixed mini dome IP camera featuring deep learning-based human and vehicle classification, 120dB True WDR, and a built-in microphone. Rated IP67 and IK08 for robust protection.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3182w-28sda.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "DOME"],
      "camera_resolution": ["8MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3182W-28SDA",
        "name": "Platinum 8 MP Smart Fixed Mini Dome IP Camera",
        "description": "8MP Mini Dome with AI Analytics and Audio.",
        "price": 220.00
      }
    ],
    "specs": {
      "Resolution": "8MP (3840x2160)",
      "Lens": "2.8mm Fixed",
      "AI Analytics": "Human/Vehicle Detection",
      "Audio": "Built-in Microphone",
      "WDR": "120 dB",
      "Protection": "IP67, IK08"
    }
  },
  {
    "series_id": "CMIP3283W-SDZ",
    "name": "Platinum 8 MP Motorized Varifocal Turret Camera",
    "description": "8MP Turret with 2.8-12mm motorized lens, AI MD 2.0, and vandal resistance.",
    "long_description": "The LTS CMIP3283W-SDZ is an 8MP 4K IP turret camera featuring a motorized varifocal lens (2.8–12 mm) for remote zoom and focus. It includes Motion Detection 2.0 for accurate target classification, 120dB True WDR, and IK10 vandal resistance.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3283w-sdz.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["8MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3283W-SDZ",
        "name": "Platinum 8 MP Motorized Varifocal Turret Camera",
        "description": "8MP Turret with motorized zoom/focus.",
        "price": 350.00
      }
    ],
    "specs": {
      "Resolution": "8MP (4K)",
      "Lens": "2.8-12mm Motorized Varifocal",
      "AI Analytics": "MD 2.0 Human/Vehicle Detection",
      "WDR": "120 dB",
      "Protection": "IP67, IK10"
    }
  },
  {
    "series_id": "CMIP3382WI-28SDL",
    "name": "Platinum 8 MP Active Deterrence Turret Camera",
    "description": "8MP 4K Turret with active strobe, audio alarm, and smart hybrid light.",
    "long_description": "The LTS CMIP3382WI-28SDL is an 8MP (4K) active deterrence turret camera featuring a strobe light and audio alarm to deter intruders. It includes Smart Hybrid Light technology, 120dB True WDR, and MD 2.0 human/vehicle classification.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3382wi-28sdl.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["8MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3382WI-28SDL",
        "name": "Platinum 8 MP Active Deterrence Turret Camera",
        "description": "8MP 4K Turret with Active Deterrence features.",
        "price": 240.00
      }
    ],
    "specs": {
      "Resolution": "8MP (3840x2160)",
      "Lens": "2.8mm Fixed",
      "Deterrence": "Active Strobe Light & Audio Alarm",
      "Lighting": "Smart Hybrid Light",
      "AI Analytics": "MD 2.0 Human/Vehicle Detection",
      "Protection": "IP67"
    }
  },
  {
    "series_id": "CMIP3C42WI-MDA",
    "name": "Platinum 4 MP Color 24/7 Fixed Turret Camera",
    "description": "4MP Color 24/7 Turret with smart hybrid lighting and F1.0 super aperture.",
    "long_description": "The LTS CMIP3C42WI-MDA is a 4MP outdoor network turret camera featuring Color 24/7 technology with an F1.0 lens for full-color imaging in low light. It includes smart hybrid illumination (IR + White Light), 120dB True WDR, and a built-in microphone.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3c42wi-mda.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["4MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3C42WI-MDA",
        "name": "Platinum 4 MP Color 24/7 Fixed Turret Camera",
        "description": "4MP Color 24/7 Turret with Smart Dual-Light.",
        "price": 190.00
      }
    ],
    "specs": {
      "Resolution": "4MP (2688x1520)",
      "Lens": "2.8mm F1.0",
      "Lighting": "Smart Hybrid Light (IR + White)",
      "Color Tech": "Color 24/7 Full Color",
      "Audio": "Built-in Microphone",
      "Protection": "IP67"
    }
  },
  {
    "series_id": "CMIP3C82WI-28MDA",
    "name": "Platinum 8 MP Color 24/7 Fixed Turret Camera",
    "description": "8MP (4K) Color 24/7 Turret with 130 dB WDR and Smart Hybrid Light.",
    "long_description": "The LTS CMIP3C82WI-28MDA is an 8MP Platinum Series turret camera featuring Color 24/7 technology for vivid images in low light. It includes a 130dB True WDR, Smart Hybrid Light (IR + White), and Motion Detection 2.0 with human/vehicle classification.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3c82wi-28mda.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET"],
      "camera_resolution": ["8MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3C82WI-28MDA",
        "name": "Platinum 8 MP Color 24/7 Fixed Turret Camera - White",
        "description": "8MP Color 24/7 Turret with white housing.",
        "price": 260.00
      },
      {
        "sku": "CMIP3C82WIB-28MDA",
        "name": "Platinum 8 MP Color 24/7 Fixed Turret Camera - Black",
        "description": "8MP Color 24/7 Turret with black housing.",
        "price": 260.00
      }
    ],
    "specs": {
      "Resolution": "8MP (3840x2160)",
      "Lens": "2.8mm Fixed",
      "WDR": "130 dB",
      "Lighting": "Smart Hybrid Light",
      "Color Tech": "Color 24/7 Full Color",
      "Protection": "IP67"
    }
  },
  {
    "series_id": "CMIP3C8PW-SDL",
    "name": "Platinum 8 MP Panoramic Turret IP Camera",
    "description": "8MP (5120x1440) 180° Panoramic Turret with Active Deterrence and Two-Way Audio.",
    "long_description": "The LTS CMIP3C8PW-SDL is a Platinum Series 8MP panoramic turret IP camera featuring dual sensors for a seamless 180° field of view. It includes active deterrence (strobe and audio alarm), two-way audio, and Color 24/7 imaging with F1.0 super-aperture lenses.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip3c8pw-sdl.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "TURRET", "PANORAMIC"],
      "camera_resolution": ["8MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP3C8PW-SDL",
        "name": "Platinum 8 MP Panoramic Turret IP Camera",
        "description": "8MP 180° Panoramic Turret with Active Deterrence.",
        "price": 320.00
      }
    ],
    "specs": {
      "Resolution": "8MP (5120x1440)",
      "FOV": "180° Horizontal",
      "Deterrence": "Active Strobe Light & Audio Alarm",
      "Audio": "Two-way Audio (Built-in Mic & Speaker)",
      "Color Tech": "Color 24/7 Full Color",
      "Protection": "IP67"
    }
  },
  {
    "series_id": "CMIP7112F-SE",
    "name": "Platinum 12 MP Panoramic Fisheye Camera",
    "description": "12MP 360° Fisheye with Heat Mapping, two-way audio, and vandal resistance.",
    "long_description": "The LTS CMIP7112F-SE is a 12MP panoramic fisheye IP camera providing a complete 360-degree field of view. It features deep learning-based heat mapping, multiple dewarping modes, built-in microphone and speaker, and IK10 vandal resistance.",
    "image": "https://media.ltsecurityinc.com/media/catalog/product/c/m/cmip7112f-se.jpg",
    "facets": {
      "category": ["IP SOLUTIONS", "PANORAMIC", "FISHEYE"],
      "camera_resolution": ["12MP"],
      "camera_technology": ["IP/NETWORK"],
      "camera_series": ["PLATINUM SERIES"]
    },
    "variants": [
      {
        "sku": "CMIP7112F-SE",
        "name": "Platinum 12 MP Panoramic Fisheye Camera",
        "description": "12MP 360° Panoramic Fisheye Camera.",
        "price": 450.00
      }
    ],
    "specs": {
      "Resolution": "12MP (3504x3504)",
      "FOV": "360° Panoramic",
      "Analytics": "Heat Mapping & People Counting",
      "Audio": "Two-way Audio",
      "WDR": "120 dB",
      "Protection": "IP67, IK10"
    }
  }
]

with open(products_file, 'r') as f:
    content = f.read()

insert_pos = content.rfind('];')
if insert_pos != -1:
    formatted_json = json.dumps(new_products, indent=2)[1:-1].strip()
    # Check if there is already a trailing comma
    prefix = ",\n  "
    new_content = content[:insert_pos] + prefix + formatted_json + "\n" + content[insert_pos:]
    with open(products_file, 'w') as f:
        f.write(new_content)
    print(f"Successfully added {len(new_products)} products to products.js")
else:
    print("Could not find the end of the products array in products.js")

# Update missing SKUs files
processed_skus = [
    "CMIP1382NW-28MA", "CMIP1382WE-28MDA", "CMIP1C42W-28MDA", "CMIP1C42WB-28MDA",
    "CMIP3182W-28SDA", "CMIP3283W-SDZ", "CMIP3382WI-28SDL", "CMIP3C42WI-MDA",
    "CMIP3C82WI-28MDA", "CMIP3C82WIB-28MDA", "CMIP3C8PW-SDL", "CMIP7112F-SE"
]

def update_file(filepath, skus):
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            lines = f.readlines()
        new_lines = [line for line in lines if line.strip().split(' ')[0] not in skus]
        with open(filepath, 'w') as f:
            f.writelines(new_lines)
        print(f"Updated {filepath}")

update_file('/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/clean_missing_skus.txt', processed_skus)
update_file('/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/truly_missing_skus.txt', processed_skus)
update_file('/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/verified_missing_skus_from_clean.txt', processed_skus)
