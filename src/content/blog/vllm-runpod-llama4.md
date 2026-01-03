---
title: 'vLLM on RunPod: Quick Start'
description: 'Running Llama 4 Scout with vLLM on RunPod H200s'
pubDate: 'Jan 03 2026'
heroImage: '../../assets/hero-vllm.png'
tags: ['python', 'ai', 'vllm']
---

Quick guide to running Llama 4 with vLLM on RunPod.

## Table of Contents

## Create RunPod Account

Sign up at [runpod.io](https://runpod.io). Add credits - GPU pods bill per hour.

## Create a Pod

1. Go to **Pods** → **+ Deploy**
2. Select GPU: **2x H200 SXM** (140GB total VRAM)
3. Pick a template with CUDA (e.g., `RunPod Pytorch`)
4. **Important**: Increase volume storage to **100GB+** - models are large
5. Deploy

Why 2x H200? One 80GB GPU wasn't enough. FP8 also needs newer hardware - A40s won't work.

## SSH In

Once the pod is running, grab the SSH command from the pod details:

```bash
ssh root@xyz.runpod.io -p 12345 -i ~/.ssh/id_rsa
```

## Install vLLM

```bash
uv pip install vllm --system
```

Set your HuggingFace token for gated models:

```bash
export HF_TOKEN="hf_xxx"
```

## Run

```python
from vllm import LLM

llm = LLM(
    model="nvidia/Llama-4-Scout-17B-16E-Instruct-FP8",
    tensor_parallel_size=2,
    max_model_len=1024,
    enforce_eager=True,
)

output = llm.generate("Hello, how are you?")
print(output)
```

- `tensor_parallel_size=2` - splits model across both GPUs
- `enforce_eager=True` - disables CUDA graphs for stability

## My Setup

- 2x H200 SXM
- vLLM 0.13.0
- Llama-4-Scout-17B-16E-Instruct-FP8
