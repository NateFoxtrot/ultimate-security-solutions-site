#!/usr/bin/env python3
"""SDXL txt2img — round 7: structured cabling rack regen."""
import torch
from diffusers import StableDiffusionXLPipeline

CKPT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/marketing/Fooocus/models/checkpoints/juggernautXL_v8Rundiffusion.safetensors"
OUT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/assets/images/gen"

pipe = StableDiffusionXLPipeline.from_single_file(
    CKPT, torch_dtype=torch.float16, use_safetensors=True)
pipe.enable_model_cpu_offload()

NEG = ("text, watermark, logo, deformed, melted, warped metal, asymmetrical rack, "
       "broken cables, tangled wires, messy, blurry, low quality, cartoon, illustration, "
       "oversaturated, people, hands")

JOBS = [
    # Seed A — classic clean patch panel close-up
    ("cabling-rack2a",
     "professional photograph of a data center patch panel: straight horizontal rows of neatly "
     "terminated blue ethernet cables plugged into a black 48-port patch panel, cables dressed "
     "in perfect parallel runs into vertical cable managers, dark server room, cool LED lighting, "
     "symmetrical composition, photorealistic, 35mm",
     501),
    # Seed B — angled view with cable bundles
    ("cabling-rack2b",
     "professional photograph of blue CAT6 cables in clean velcro bundles sweeping down from "
     "overhead cable tray into a server rack, patch panels and network switches with green status "
     "LEDs, dark data center, moody professional lighting, photorealistic, 35mm",
     502),
    # Seed C — tight shot of cable manager
    ("cabling-rack2c",
     "professional photograph, close-up of immaculately organized network cables in a rack cable "
     "manager, uniform blue ethernet patch cords in perfect combed rows, horizontal cable management "
     "bars between switch panels, dark IT closet, photorealistic, 35mm",
     503),
]

for name, prompt, seed in JOBS:
    gen = torch.Generator(device="cuda").manual_seed(seed)
    img = pipe(prompt=prompt, negative_prompt=NEG, width=1024, height=768,
               num_inference_steps=32, guidance_scale=7.0, generator=gen).images[0]
    img.save(f"{OUT}/{name}.jpg", quality=85)
    print(f"done {name}", flush=True)
print("ALL DONE")
