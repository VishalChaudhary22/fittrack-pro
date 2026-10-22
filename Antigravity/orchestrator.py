import asyncio
import os
import json
from dotenv import load_dotenv

from google.antigravity import Agent
from agents.strategy_agent import get_strategy_config
from agents.content_agent import get_content_config
from agents.branding_agent import get_branding_config
from agents.distribution_agent import get_distribution_config

load_dotenv()

async def run_full_pipeline(weeks: int = 1):
    print(f"--- Starting Kaaya Fit Marketing Pipeline for {weeks} week(s) ---")
    
    # 1. Strategy Agent
    print("\n[1] Strategy Agent is analyzing trends and building calendar...")
    strategy_output = ""
    async with Agent(get_strategy_config()) as strategy_agent:
        response = await strategy_agent.chat(f"Analyze current Indian fitness trends and generate a {weeks}-week content calendar. Save it.")
        strategy_output = await response.text()
        print(f"Strategy Output: {strategy_output[:200]}...")

    # 2. Content Agent
    print("\n[2] Content Agent is creating posts from the calendar...")
    content_output = ""
    async with Agent(get_content_config()) as content_agent:
        response = await content_agent.chat(
            "Look at the first post planned in the calendar and generate a platform-optimized caption, "
            "hashtags, and an image generation prompt for it."
        )
        content_output = await response.text()
        print(f"Content Output: {content_output[:200]}...")

    # 3. Branding Agent
    print("\n[3] Branding Agent is reviewing content for Kaaya Fit guidelines...")
    branding_output = ""
    async with Agent(get_branding_config()) as branding_agent:
        response = await branding_agent.chat(
            f"Review this generated content against the brand guidelines. "
            f"Check for forbidden terms and brand tone: {content_output}"
        )
        branding_output = await response.text()
        print(f"Branding Output: {branding_output[:200]}...")
        
    # 4. Distribution Agent
    print("\n[4] Distribution Agent is packaging approved content...")
    async with Agent(get_distribution_config()) as dist_agent:
        response = await dist_agent.chat(
            f"Package this approved content and schedule it for the optimal time: {content_output}. "
            f"Branding notes: {branding_output}"
        )
        print(f"Distribution Output: {await response.text()[:200]}...")

    print("\n--- Pipeline Complete! Check data/assets for the package ---")

if __name__ == "__main__":
    asyncio.run(run_full_pipeline())
