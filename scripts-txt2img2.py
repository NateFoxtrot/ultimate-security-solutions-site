#!/usr/bin/env python3
"""SDXL txt2img — round 2 fixes for USS website imagery (owner feedback)."""
import torch, os
from diffusers import StableDiffusionXLPipeline

CKPT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/marketing/Fooocus/models/checkpoints/juggernautXL_v8Rundiffusion.safetensors"
OUT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/assets/images/gen"

pipe = StableDiffusionXLPipeline.from_single_file(
    CKPT, torch_dtype=torch.float16, use_safetensors=True)
pipe.enable_model_cpu_offload()

NEG = ("text, watermark, logo, brand names, deformed hands, extra fingers, fused fingers, "
       "distorted face, creepy expression, snarling, blurry, low quality, cartoon, illustration, "
       "painting, oversaturated, tangled wires, messy cables, spaghetti, junction box on wall")

JOBS = [
    # STRUCTURED CABLING — owner: "neatly organized network cabling being routed into server rack"
    ("cabling-rack",
     "professional photograph of immaculate structured cabling: neatly combed bundles of blue CAT6 "
     "ethernet cables in velcro ties routed into a black server rack patch panel, perfect cable "
     "management, data center quality, dark server room with cool LED accent lighting, "
     "shallow depth of field, photorealistic, 35mm",
     1024, 768, 101),
    # SURVEILLANCE — clean professional ceiling dome install (no junction box on wall)
    ("cctv-dome-install",
     "professional photograph of a white dome security camera cleanly flush-mounted on a commercial "
     "drop ceiling tile, cable fully concealed, modern office corridor with recessed lighting, "
     "clean professional security installation, photorealistic, 35mm, shallow depth of field",
     1024, 768, 102),
    # ACCESS CONTROL — realistic wall-mounted card reader + keypad by commercial door
    ("access-reader",
     "professional photograph of a modern black access control card reader with keypad and small "
     "status LED, wall-mounted next to a commercial aluminum-frame glass door, clean installation, "
     "corporate office lobby, shallow depth of field, photorealistic, 35mm",
     1024, 768, 103),
    # SMART HANDS — tech actively terminating/punching down in network closet
    ("smart-hands-terminating",
     "professional photograph of a field technician's hands using a punch down tool terminating "
     "network cables on a patch panel in a network closet, technician wearing dark polo work shirt, "
     "focused work in progress, server rack with switches behind, moody commercial lighting, "
     "photorealistic, 35mm",
     1024, 768, 104),
    # DIY — owner at desk cleanly unboxing a camera, no weird lamp
    ("diy-unbox2",
     "bright natural daylight photograph, small business owner in plain navy polo shirt smiling "
     "slightly while lifting a white turret security camera out of a plain cardboard box on a clean "
     "wooden desk, modern home office with window light, laptop beside the box, "
     "photorealistic, 35mm",
     1024, 768, 105),
]

os.makedirs(OUT, exist_ok=True)
for name, prompt, w, h, seed in JOBS:
    dest = f"{OUT}/{name}.jpg"
    if os.path.exists(dest):
        print(f"skip {name}", flush=True)
        continue
    gen = torch.Generator(device="cuda").manual_seed(seed)
    img = pipe(prompt=prompt, negative_prompt=NEG, width=w, height=h,
               num_inference_steps=30, guidance_scale=7.0, generator=gen).images[0]
    img.save(dest, quality=85)
    print(f"done {name}", flush=True)
print("ALL DONE")
