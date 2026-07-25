#!/usr/bin/env python3
"""SDXL img2img cleanup of messy rack photos -> professional 'after' versions."""
import torch
from diffusers import StableDiffusionXLImg2ImgPipeline
from PIL import Image

CKPT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/marketing/Fooocus/models/checkpoints/juggernautXL_v8Rundiffusion.safetensors"
OUT = "/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final/assets/images/work"

pipe = StableDiffusionXLImg2ImgPipeline.from_single_file(
    CKPT, torch_dtype=torch.float16, use_safetensors=True)
pipe.enable_model_cpu_offload()

PROMPT = ("professional network server rack with immaculate cable management, "
          "neatly bundled velcro cables, tidy patch panels, organized wiring, "
          "clean professional installation, commercial IT closet, high quality photo")
NEG = ("messy cables, tangled wires, spaghetti cables, clutter, blurry, low quality, "
       "watermark, text, deformed")

for name in ["messyrack2", "messyrack3", "messyrack4"]:
    src = Image.open(f"{OUT}/{name}.jpg").convert("RGB")
    w, h = src.size
    scale = 1024 / max(w, h)
    nw, nh = int(w * scale) // 8 * 8, int(h * scale) // 8 * 8
    src = src.resize((nw, nh), Image.LANCZOS)
    out = pipe(prompt=PROMPT, negative_prompt=NEG, image=src,
               strength=0.45, num_inference_steps=30, guidance_scale=7.0).images[0]
    out.save(f"{OUT}/{name}-after.jpg", quality=88)
    print(f"done {name}", flush=True)

print("ALL DONE")
