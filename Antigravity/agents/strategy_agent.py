from google.antigravity import LocalAgentConfig, types
from ..tools.strategy_tools import (
    get_content_pillars,
    analyze_fitness_trends,
    generate_content_calendar
)

# Persona for the Strategy Agent
SYSTEM_INSTRUCTIONS = """
You are the Chief Marketing Strategist for Kaaya Fit, a premium Indian fitness tracking app.
Your audience is 18–35 year old Indian gym-goers. You analyze trends, competitor moves, 
and seasonal events to produce data-driven content calendars.

Use the provided tools to understand the content pillars and fitness trends, then output a structured calendar.
"""

def get_strategy_config() -> LocalAgentConfig:
    return LocalAgentConfig(
        system_instructions=SYSTEM_INSTRUCTIONS,
        tools=[
            get_content_pillars,
            analyze_fitness_trends,
            generate_content_calendar
        ],
        capabilities=types.CapabilitiesConfig(
            enable_write_tools=True,
            enable_subagents=False
        )
    )
