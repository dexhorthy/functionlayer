<div align="center">

![Logo of functionlayer, two diamonds with a plus sign](./docs/functionlayer_logo.png)

# **FunctionLayer**

**FunctionLayer**: python SDK to enable AI agents to communicate with humans in tool-based and asynchronous workflows. By incorporating humans-in-the-loop, agentic tools can be given access to much more powerful and meaningful tool calls and tasks. Bring your LLM (OpenAI, Claude, etc) and Framework (LangChain, CrewAI, etc) and start giving your AI agents safe access to the world.

<h3>

[Homepage](https://www.functionlayer.ai/) | [Getting Started Guide](./docs/getting-started.md) | [Documentation](./docs) | [Examples](./examples) 

</h3>

[![GitHub Repo stars](https://img.shields.io/github/stars/functionlayer/functionlayer)](https://github.com/functionlayer/functionlayer)
[![License: Apache-2](https://img.shields.io/badge/License-Apache-green.svg)](https://opensource.org/licenses/Apache-2)

</div>

## Table of contents

- [Why FunctionLayer?](#why-functionlayer)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Why FunctionLayer?

Functions and tools are a key part of [Agentic Workflows](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance). They enable LLMs to interact meaningfully with the outside world and automate broad scopes of impactful work. Correct and accurate function calling is essential for AI agents that do meaningful things like book appointments, interact with customers, manage billing information, write+execute code, and more.

[![Tool Calling Loop from Louis Dupont](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*r8rEqjGZs_e6dibWeaqaQg.png)](https://louis-dupont.medium.com/transforming-software-interactions-with-tool-calling-and-llms-dc39185247e9)
*From https://louis-dupont.medium.com/transforming-software-interactions-with-tool-calling-and-llms-dc39185247e9*

**However**, the most useful functions we can give to an LLM are also the most risky. We can all imagine the value of an AI Database Administrator that constantly tunes and refactors our SQL database, but most teams wouldn't give an LLM access to run arbitrary SQL statements against a production database (heck, we mostly don't even let humans do that). That is, **even with state-of-the-art agentic reasoning and prompt routing, LLMs are not sufficiently reliable to be given access to certain higher-stakes functions without human oversight.**

<div align="center">
<h3><blockquote>Even with state-of-the-art agentic reasoning and prompt routing, LLMs are not sufficiently reliable to be given access to high-stakes functions without human oversight</blockquote></h3>
</div>

To better define what is meant by "high stakes", some examples:

- **Low Stakes**: Read Access to public data (e.g. search wikipedia, access public APIs and DataSets)
- **Low Stakes**: Communicate with agent author (e.g. an engineer might empower an agent to send them a private Slack message with updates on progress)
- **Medium Stakes**: Read Access to Private Data (e.g. read emails, access calendars, query a CRM)
- **High Stakes**: Communicate on my Behalf or on behalf of my Company (e.g. send emails, post to slack, publish social/blog content)
- **High Stakes**: Write Access to Private Data (e.g. update CRM records, modify feature toggles, update billing information)

![Image showing the levels of function stakes stacked on top of one another](./docs/images/function_stakes.png)

The high stakes functions are the ones that are the most valuable and promise the most impact in automating away human workflows. The sooner teams can get Agents reliably and safely calling these tools, the sooner they can reap massive benefits. 

FunctionLayer provides a set of tools to *deterministically* gate access to these functions. Even if the LLM makes a mistake or hallucinates, FunctionLayer is baked into the tool/function itself, guaranteeing human oversight of high stakes function calls.

![Function Layer @require_approval decorator wrapping the Commnicate on my behalf function](./docs/images/function_layer_require_approval.png)

## Key Features

- **Require Human Approval for Function Calls**: the `@fl.require_approval()` decorator blocks specifc function calls until a human has been consulted - upon denial, feedback will be passed to the LLM
- **Human as Tool**: generic `fl.human_as_tool()` allows for contacting a human for answers, advice, or feedback
- **OmniChannel Contact**: Contact humans and collect responses across Slack, Email, Discord, and more
- **Granular Routing**: Route approvals to specific teams or individuals
- **Bring your own LLM + Framework**: Because FunctionLayer is implemented at tools layer, it supports any LLM and all major orchestration frameworks that support tool calling.


## Getting Started

To get started, check out [Getting Started](./getting-started.md) or jump straight into one of the [Examples](../examples/):

- 🦜⛓️ [LangChain](./examples/langchain/math_example.py)
- 🚣‍ [CrewAI](./examples/crewai/crewai_math.py)
- 🦾 [ControlFlow](./examples/controlflow/controlflow_math.py)
- 🧠 [Raw OpenAI Client](./examples/openai_client/math_example.py)

### 1. Installation

```shell
pip install functionlayer
```

or for the bleeding edge

```shell
pip install git+https://github.com/functionlayer/functionlayer
```

### 2. Wrapping Your First Function

Set an API token, and then wrap your AI function in

```python

from functionlayer import ApprovalMethod, FunctionLayer
fl = FunctionLayer(approval_method=ApprovalMethod.CLOUD) # or CLI

@fl.require_approval()
def send_email(to: str, subject: str, body: str):
    """Send an email to the customer"""
    ... 


# made up method, use whatever framework you prefer
run_llm_task(
    prompt="Send an email welcoming the customer to the platform and encouraging them to invite a team member.",
    tools=[send_email],
    llm=OpenAI(model="gpt-4o")
)
```

Then you can start manging LLM actions in slack, email, or whatever channel you prefer:

![A screenshot of slack showing a human replying to the bot](./docs/images/slack_approval_response.png)

Check out the [FunctionLayer Docs](./docs/) and the [Getting Started Guide](./docs/getting-started.md) for more information.


## Examples

You can test different real life examples of FunctionLayer in the [examples folder](./examples/):

- 🦜⛓️ [LangChain Math](./examples/langchain/math_example.py)
- 🦜⛓️ [LangChain Human As Tool](./examples/langchain/human_as_tool.py)
- 🚣‍ [CrewAI Math](./examples/crewai/crewai_math.py)
- 🦾 [ControlFlow Math](./examples/controlflow/controlflow_math.py)
- 🧠 [Raw OpenAI Client](./examples/openai_client/math_example.py)

## Contributing

FunctionLayer is open-source and we welcome contributions in the form of issues, documentation, pull requests, and more. See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## License

The FunctionLayer SDK in this repo is licensed under the Apache 2 License.
