#!/usr/bin/env python3
"""SDXL txt2img — round 4: fix gibberish text + hands issues."""
import torch
from diffusers import StableDiffusionXLPipeline

CKPT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/marketing/Fooocus/models/checkpoints/juggernautXL_v8Rundiffusion.safetensors"
OUT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/assets/images/gen"

pipe = StableDiffusionXLPipeline.from_single_file(
    CKPT, torch_dtype=torch.float16, use_safetensors=True)
pipe.enable_model_cpu_offload()

NEG = ("text, letters, numbers, words, keypad buttons, watermark, logo, brand names, "
       "deformed hands, extra fingers, fused fingers, creepy face, distorted face, "
       "blurry, low quality, cartoon, illustration, readable text, gibberish")

JOBS = [
    # access reader WITHOUT keypad (proximity-only, no buttons to garble)
    ("access-reader2",
     "professional photograph of a sleek modern black proximity card reader with a single glowing "
     "blue LED ring, no buttons no keypad, wall-mounted beside a commercial aluminum-frame glass "
     "door, corporate lobby, shallow depth of field, photorealistic, 35mm",
     201),
    # smart hands: face-out-of-frame, gloved hands only
    ("smart-hands2",
     "professional photograph cropped at the chest down, technician wearing black work gloves "
     "inserting blue ethernet cables into a patch panel on a server rack, dark network closet, "
     "moody commercial lighting, no face visible, photorealistic, 35mm",
     202),
    # DIY: camera OUT of box on desk, person's hands only, face out of frame
    ("diy-unbox3",
     "bright natural daylight photograph, white turret security camera sitting on an open cardboard "
     "box on a wooden desk next to a laptop, person's hands lifting bubble wrap, face out of frame, "
     "modern home office with window light, photorealistic, 35mm",
     203),
    # menu board: screens showing abstract glow, no readable menu text
    ("menuboard2",
     "professional photograph of an outdoor digital menu board at a quick-service drive-thru at "
     "dusk, large display glowing with blurred colorful food photography (no readable text, bokeh "
     "blur on screen content), dark commercial lighting, photorealistic, 35mm",
     204),
]

import os
for name, prompt, seed in JOBS:
    gen = torch.Generator(device="cuda").manual_seed(seed)
    img = pipe(prompt=prompt, negative_prompt=NEG, width=1024, height=768,
               num_inference_steps=30, guidance_scale=7.5, generator=gen).images[0]
    img.save(f"{OUT}/{name}.jpg", quality=85)
    print(f"done {name}", flush=True)
print("ALL DONE")
