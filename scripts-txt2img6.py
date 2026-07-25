#!/usr/bin/env python3
"""SDXL txt2img — round 6: clean desk scene for DIY composite."""
import torch
from diffusers import StableDiffusionXLPipeline

CKPT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/marketing/Fooocus/models/checkpoints/juggernautXL_v8Rundiffusion.safetensors"
OUT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/assets/images/gen"

pipe = StableDiffusionXLPipeline.from_single_file(
    CKPT, torch_dtype=torch.float16, use_safetensors=True)
pipe.enable_model_cpu_offload()

NEG = ("text, letters, watermark, logo, face, person, hands, deformed, blurry, low quality, cartoon")

gen = torch.Generator(device="cuda").manual_seed(401)
img = pipe(
    prompt=("bright clean photograph of an empty modern wooden desk with an open cardboard shipping "
            "box and bubble wrap on it, laptop in background, bright natural window light from the "
            "left, home office, shallow depth of field, photorealistic, 35mm"),
    negative_prompt=NEG, width=1024, height=768,
    num_inference_steps=30, guidance_scale=7.0, generator=gen).images[0]
img.save(f"{OUT}/diy-desk.jpg", quality=85)
print("done diy-desk")
