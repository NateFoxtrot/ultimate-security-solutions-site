#!/usr/bin/env python3
"""SDXL txt2img — round 5."""
import torch
from diffusers import StableDiffusionXLPipeline

CKPT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/marketing/Fooocus/models/checkpoints/juggernautXL_v8Rundiffusion.safetensors"
OUT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/assets/images/gen"

pipe = StableDiffusionXLPipeline.from_single_file(
    CKPT, torch_dtype=torch.float16, use_safetensors=True)
pipe.enable_model_cpu_offload()

NEG = ("text, letters, numbers, words, watermark, logo, face, head, portrait, person face, "
       "deformed hands, extra fingers, creepy, distorted, blurry, low quality, cartoon, readable text")

JOBS = [
    # smart hands: extreme close-up of hands+tool only
    ("smart-hands3",
     "extreme close-up macro photograph of gloved hands using a punch down impact tool on a network "
     "patch panel, blue ethernet cables, dark server rack background, shallow depth of field, "
     "no people no face, photorealistic, 35mm",
     301),
    # DIY: over-shoulder shot from behind, camera visible on desk
    ("diy-unbox4",
     "over-the-shoulder photograph from behind a person, looking down at a white dome security "
     "camera and open product packaging on a wooden desk with a laptop, bright window light, "
     "home office, no face visible, photorealistic, 35mm",
     302),
    # menu board: blank glowing screen
    ("menuboard3",
     "professional photograph of an outdoor drive-thru digital menu board kiosk at dusk, screen "
     "glowing with smooth abstract orange and yellow gradient (no text no images), speaker post, "
     "dark evening lighting, photorealistic, 35mm",
     303),
]

for name, prompt, seed in JOBS:
    gen = torch.Generator(device="cuda").manual_seed(seed)
    img = pipe(prompt=prompt, negative_prompt=NEG, width=1024, height=768,
               num_inference_steps=32, guidance_scale=7.5, generator=gen).images[0]
    img.save(f"{OUT}/{name}.jpg", quality=85)
    print(f"done {name}", flush=True)
print("ALL DONE")
