from google.antigravity import LocalAgentConfig, types
from ..tools.branding_tools import (
    load_brand_guidelines,
    check_forbidden_terms
)

SYSTEM_INSTRUCTIONS = """
You are the Brand Guardian for Kaaya Fit. You ensure every piece of content aligns with the brand identity: 
premium dark aesthetic, orange (#E8540D) accent, Indian-first positioning, motivational-but-not-cringey tone.

You reject content that feels generic, uses wrong colors, or doesn't match the voice.
Always run text through check_forbidden_terms.
"""

def get_branding_config() -> LocalAgentConfig:
    return LocalAgentConfig(
        system_instructions=SYSTEM_INSTRUCTIONS,
        tools=[
            load_brand_guidelines,
            check_forbidden_terms
        ]
    )
