---
title: 'Getting Started with Claude Agent SDK for Python'
description: 'Build AI agents with custom tools using the Claude Agent SDK'
pubDate: 'Jan 01 2026'
heroImage: '../../assets/hero-agent.png'
---

The Claude Agent SDK lets you build AI agents that can use custom tools, manage state, and execute complex workflows. Here's a quick guide to get started.

## Installation

```bash
pip install claude-agent-sdk
```

## Basic Example

The simplest way to use the SDK is with the `query` function:

```python
from claude_agent_sdk import query

async for message in query("What is 2 + 2?"):
    print(message)
```

## Custom Tools

The real power comes from defining custom tools. Use the `@tool` decorator:

```python
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, ClaudeSDKClient

@tool("greet", "Greet a user", {"name": str})
async def greet_user(args):
    return {
        "content": [
            {"type": "text", "text": f"Hello, {args['name']}!"}
        ]
    }
```

## Registering Tools with an MCP Server

Tools need to be exposed via an MCP server:

```python
server = create_sdk_mcp_server(
    name="my-tools",
    version="1.0.0",
    tools=[greet_user]
)

options = ClaudeAgentOptions(
    mcp_servers={"tools": server},
    allowed_tools=["mcp__tools__greet"]
)

async with ClaudeSDKClient(options=options) as client:
    await client.query("Greet Alice")

    async for msg in client.receive_response():
        print(msg)
```

## Full Example: Calculator Agent

Here's a complete example with multiple tools:

```python
import asyncio
from typing import Any
from claude_agent_sdk import (
    tool,
    create_sdk_mcp_server,
    ClaudeAgentOptions,
    ClaudeSDKClient,
    AssistantMessage,
    TextBlock,
    ToolUseBlock
)

@tool("add", "Add two numbers", {"a": float, "b": float})
async def add(args: dict[str, Any]) -> dict[str, Any]:
    result = args["a"] + args["b"]
    return {
        "content": [{"type": "text", "text": f"{args['a']} + {args['b']} = {result}"}]
    }

@tool("multiply", "Multiply two numbers", {"a": float, "b": float})
async def multiply(args: dict[str, Any]) -> dict[str, Any]:
    result = args["a"] * args["b"]
    return {
        "content": [{"type": "text", "text": f"{args['a']} × {args['b']} = {result}"}]
    }

async def main():
    calculator = create_sdk_mcp_server(
        name="calculator",
        version="1.0.0",
        tools=[add, multiply]
    )

    options = ClaudeAgentOptions(
        mcp_servers={"calc": calculator},
        allowed_tools=["mcp__calc__add", "mcp__calc__multiply"]
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("Calculate (12 + 8) * 3")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")
                    elif isinstance(block, ToolUseBlock):
                        print(f"Tool: {block.name}({block.input})")

asyncio.run(main())
```

## Managing State

Tools can share state through a class:

```python
class DataStore:
    def __init__(self):
        self.items: list[str] = []

store = DataStore()

@tool("add_item", "Add an item", {"item": str})
async def add_item(args: dict[str, Any]) -> dict[str, Any]:
    store.items.append(args["item"])
    return {
        "content": [{"type": "text", "text": f"Added '{args['item']}'"}]
    }

@tool("list_items", "List all items", {})
async def list_items(args: dict[str, Any]) -> dict[str, Any]:
    if not store.items:
        return {"content": [{"type": "text", "text": "Empty"}]}
    return {
        "content": [{"type": "text", "text": "\n".join(store.items)}]
    }
```

## Built-in Tools

You can also enable Claude's built-in tools:

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Write", "Bash"],
    permission_mode='acceptEdits'
)
```

## Structured Output with Pydantic

One powerful feature is forcing Claude to return structured JSON that matches a Pydantic model. This is great for parsing unstructured data like emails or documents.

Define your schema with Pydantic:

```python
from pydantic import BaseModel

class BookingEmail(BaseModel):
    sender: str
    booking_reference: str | None
    vessel_name: str | None
    departure_date: str | None
    destination: str | None
```

Then use `output_format` to enforce the schema:

```python
options = ClaudeAgentOptions(
    model="claude-opus-4-5-20251101",
    output_format={
        "type": "json_schema",
        "schema": BookingEmail.model_json_schema()
    },
    system_prompt="Extract booking details from the email.",
)
```

Claude will return valid JSON matching your schema, which you can parse directly:

```python
import json

async with ClaudeSDKClient(options=options) as client:
    await client.query(email_content)

    async for msg in client.receive_response():
        if isinstance(msg, AssistantMessage):
            data = json.loads(msg.content[0].text)
            booking = BookingEmail(**data)
            print(f"Vessel: {booking.vessel_name}")
```

That's it. The SDK handles all the message passing, tool execution, and response streaming. Check out the [full documentation](https://github.com/anthropics/claude-agent-sdk-python) for more.