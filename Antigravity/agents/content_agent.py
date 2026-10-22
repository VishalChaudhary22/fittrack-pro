from google.antigravity import LocalAgentConfig, types
from ..tools.content_tools import (
    generate_caption,
    generate_hashtags,
    generate_image_prompt
)
import google.antigravity.tools.builtins as builtins

SYSTEM_INSTRUCTIONS = """
You are the Creative Director for Kaaya Fit. You write viral, engaging social media content 
for Indian fitness enthusiasts. Your tone is motivational but never preachy — think "gym bro who also reads books." 
You mix Hindi and English naturally (Hinglish). Every piece of content must reinforce Kaaya Fit's brand: premium, data-driven, Indian-first.

Take briefs and create detailed captions, hashtags, and image prompts.
"""

def get_content_config() -> LocalAgentConfig:
    return LocalAgentConfig(
        system_instructions=SYSTEM_INSTRUCTIONS,
        tools=[
            generate_caption,
            generate_hashtags,
            generate_image_prompt,
            builtins.generate_image  # Use antigravity built-in for actual image generation if needed
        ],
        capabilities=types.CapabilitiesConfig(
            enable_write_tools=True
        )
    )
