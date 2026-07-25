#!/usr/bin/env python3
"""SDXL txt2img generation for USS website stock-style imagery."""
import torch
from diffusers import StableDiffusionXLPipeline

CKPT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/marketing/Fooocus/models/checkpoints/juggernautXL_v8Rundiffusion.safetensors"
OUT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/assets/images/gen"

pipe = StableDiffusionXLPipeline.from_single_file(
    CKPT, torch_dtype=torch.float16, use_safetensors=True)
pipe.enable_model_cpu_offload()

NEG = ("text, watermark, logo, brand names, deformed hands, extra fingers, "
       "blurry, low quality, cartoon, illustration, painting, oversaturated")

JOBS = [
    # name, prompt, width, height, seed
    ("cabling-lift",
     "photorealistic photo, technician in white hard hat and hi-vis vest standing on a scissor lift "
     "pulling blue CAT6 ethernet cable along ceiling trusses in a large dark warehouse, "
     "moody commercial industrial lighting, cinematic, shallow depth of field, 35mm photo",
     1024, 768, 11),
    ("smart-hands-tester",
     "photorealistic photo, professional field technician holding a handheld network cable certifier "
     "tester in front of a server rack with glowing switch LEDs, dark server room, "
     "moody commercial lighting, cinematic, shallow depth of field, 35mm photo",
     1024, 768, 22),
    ("ptz-install-lift",
     "photorealistic photo, technician in hard hat and full PPE safety harness on a scissor lift "
     "installing a white PTZ dome security camera on a building exterior wall at dusk, "
     "dark commercial lighting, cinematic, 35mm photo",
     1024, 768, 33),
    ("access-control-door",
     "photorealistic photo, modern commercial glass entry door slightly ajar, electronic card reader "
     "mounted on wall beside it, magnetic lock visible on top door frame, crash bar push handle, "
     "dark commercial lobby lighting, cinematic, 35mm photo",
     1024, 768, 44),
    ("equipment-flatlay",
     "photorealistic product photography, flat lay arrangement on dark surface: white dome CCTV camera, "
     "bullet camera, black NVR recorder, access control card reader, network switch with blue LEDs, "
     "studio product lighting on dark background, commercial catalog style",
     1024, 768, 55),
    ("diy-unbox",
     "photorealistic photo, small business owner in casual shirt unboxing a white security camera "
     "at a wooden desk in a small office, open cardboard box, warm desk lamp lighting mixed with "
     "cool ambient, cinematic, 35mm photo",
     1024, 768, 66),
]

import os
os.makedirs(OUT, exist_ok=True)

for name, prompt, w, h, seed in JOBS:
    dest = f"{OUT}/{name}.jpg"
    if os.path.exists(dest):
        print(f"skip {name} (exists)", flush=True)
        continue
    gen = torch.Generator(device="cuda").manual_seed(seed)
    img = pipe(prompt=prompt, negative_prompt=NEG, width=w, height=h,
               num_inference_steps=30, guidance_scale=7.0, generator=gen).images[0]
    img.save(dest, quality=85)
    print(f"done {name}", flush=True)

print("ALL DONE")
