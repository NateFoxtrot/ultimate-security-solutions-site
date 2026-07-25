#!/usr/bin/env python3
"""SDXL txt2img — round 3: commercial AV / menu board."""
import torch
from diffusers import StableDiffusionXLPipeline

CKPT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/marketing/Fooocus/models/checkpoints/juggernautXL_v8Rundiffusion.safetensors"
OUT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/assets/images/gen"

pipe = StableDiffusionXLPipeline.from_single_file(
    CKPT, torch_dtype=torch.float16, use_safetensors=True)
pipe.enable_model_cpu_offload()

NEG = ("text, watermark, logo, brand names, deformed hands, blurry, low quality, "
       "cartoon, illustration, readable words, gibberish text")

prompt = ("professional photograph of a modern quick-service restaurant drive-thru digital menu board "
          "installation at dusk, large outdoor-rated display screen glowing with colorful food photos "
          "(no readable text), speaker post below, dark commercial lighting, photorealistic, 35mm")

gen = torch.Generator(device="cuda").manual_seed(77)
img = pipe(prompt=prompt, negative_prompt=NEG, width=1024, height=768,
           num_inference_steps=30, guidance_scale=7.0, generator=gen).images[0]
img.save(f"{OUT}/menuboard.jpg", quality=85)
print("done menuboard")
