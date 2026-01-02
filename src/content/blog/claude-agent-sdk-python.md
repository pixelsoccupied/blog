---
title: 'Structured Output with Claude Agent SDK'
description: 'Force Claude to return typed JSON using Pydantic schemas'
pubDate: 'Jan 01 2026'
heroImage: '../../assets/hero-agent.png'
tags: ['python', 'ai', 'claude']
---

The Claude Agent SDK lets you force Claude to return structured JSON that matches a Pydantic model. Super useful for parsing unstructured data.

## Installation

```bash
uv pip install claude-agent-sdk pydantic
```

## Define Your Schema

Create a Pydantic model for the data you want to extract:

```python
from pydantic import BaseModel

class ContactInfo(BaseModel):
    name: str
    email: str | None
    company: str | None
    role: str | None
```

## Configure the Agent

Use `output_format` with your model's JSON schema:

```python
from claude_agent_sdk import ClaudeAgentOptions, ClaudeSDKClient

options = ClaudeAgentOptions(
    model="claude-opus-4-5-20251101",
    output_format={
        "type": "json_schema",
        "schema": ContactInfo.model_json_schema()
    },
    system_prompt="Extract contact information from the text.",
)
```

## Parse the Response

Claude returns structured output matching your schema:

```python
import asyncio

async def extract_contact(text: str) -> ContactInfo:
    async with ClaudeSDKClient(options=options) as client:
        await client.query(text)

        async for msg in client.receive_response():
            if hasattr(msg, 'structured_output') and msg.structured_output:
                return ContactInfo.model_validate(msg.structured_output)

contact = asyncio.run(extract_contact(
    "Hey, I'm Alex from Acme Inc. Reach me at alex@acme.co"
))
print(f"{contact.name} - {contact.company}")
# Alex - Acme Inc
```

That's it. No prompt engineering needed to get consistent JSON - the SDK handles it!
