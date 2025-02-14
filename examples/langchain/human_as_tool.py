from dotenv import load_dotenv
from langchain.agents import AgentType
from langchain.agents import initialize_agent
import langchain_core.tools as langchain_tools
from langchain_openai import ChatOpenAI

from functionlayer import FunctionLayer, ApprovalMethod, ContactChannel, SlackContactChannel

load_dotenv()

fl = FunctionLayer(approval_method=ApprovalMethod.CLOUD)

task_prompt = """
figure out the wizard's favorite color, 
contact a human for help if you need it
"""

tools = [
    # langchain_tools.StructuredTool.from_function(fl.human_as_tool()),
    langchain_tools.StructuredTool.from_function(
        fl.human_as_tool(
            contact_channel=ContactChannel(
                slack=SlackContactChannel(
                    channel_or_user_id="C07BU3B7DBM",
                    context_about_channel_or_user="a DM with a bridge troll",
                ),
            )
        )
    ),
    langchain_tools.StructuredTool.from_function(
        fl.human_as_tool(
            contact_channel=ContactChannel(
                slack=SlackContactChannel(
                    channel_or_user_id="C07BU3B7DBM",
                    context_about_channel_or_user="a DM with the wizard",
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
