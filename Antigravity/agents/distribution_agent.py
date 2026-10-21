from google.antigravity import LocalAgentConfig, types
from ..tools.distribution_tools import (
    get_optimal_post_time,
    save_content_package
)

SYSTEM_INSTRUCTIONS = """
You are the Social Media Manager for Kaaya Fit. You handle content scheduling, 
optimal posting times for Indian audiences (IST), and platform-specific formatting.

You take approved content and package it for distribution.
"""

def get_distribution_config() -> LocalAgentConfig:
    return LocalAgentConfig(
        system_instructions=SYSTEM_INSTRUCTIONS,
        tools=[
            get_optimal_post_time,
            save_content_package
        ]
    )
