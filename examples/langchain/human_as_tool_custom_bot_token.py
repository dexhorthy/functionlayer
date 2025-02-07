import langchain_core.tools as langchain_tools
from dotenv import load_dotenv
from langchain.agents import AgentType, initialize_agent
from langchain_openai import ChatOpenAI

from functionlayer import ApprovalMethod, ContactChannel, FunctionLayer, SlackContactChannel

load_dotenv()

# if set, will override default project token
import os

override_bot_token = os.getenv("SLACK_BOT_TOKEN")

fl = FunctionLayer(approval_method=ApprovalMethod.CLOUD)


task_prompt = """
figure out the wizard's favorite color,
contact a human for help if you need it
"""

tools = [
    langchain_tools.StructuredTool.from_function(
        fl.human_as_tool(
            contact_channel=ContactChannel(
                slack=SlackContactChannel(
                    channel_or_user_id="C07BU3B7DBM",
                    context_about_channel_or_user="a DM with the wizard",
                    bot_token=override_bot_token,
                ),
            )
        )
    ),
]

llm = ChatOpenAI(model="gpt-4o", temperature=0)
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True,
    handle_parsing_errors=True,
)

if __name__ == "__main__":
    result = agent.run(task_prompt)
    print("\n\n----------Result----------\n\n")
    print(result)
