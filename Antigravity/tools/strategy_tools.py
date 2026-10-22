import json
import os
from typing import List, Dict, Any

def get_content_pillars() -> List[str]:
    """
    Returns Kaaya Fit's 5 content pillars.
    """
    return [
        "Education (workout science, nutrition facts)",
        "Motivation (transformation stories, daily fire)",
        "Product (feature highlights, tips & tricks)",
        "Community (user stories, challenges)",
        "Results (data visualizations, PR celebrations)"
    ]

def analyze_fitness_trends() -> str:
    """
    Scrapes and analyzes current fitness trends in India.
    (Mock implementation for Phase 1)
    """
    return (
        "Current Top Trends in Indian Fitness:\n"
        "1. Desi superfoods (Makhana, Sattu) returning to mainstream.\n"
        "2. Hybrid athlete training (combining lifting and running/marathons).\n"
        "3. Focus on joint health and mobility over pure hypertrophy.\n"
        "4. 'Sankalp' mindset - dedicating oneself to 75-day or 30-day strict challenges."
    )

def generate_content_calendar(weeks: int, plan_details: str) -> str:
    """
    Saves a generated content calendar locally.
    
    Args:
        weeks (int): Number of weeks for the calendar.
        plan_details (str): A JSON formatted string representing the calendar.
    """
    calendar_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'content_calendar.json')
    try:
        parsed_plan = json.loads(plan_details)
        with open(calendar_path, 'w', encoding='utf-8') as f:
            json.dump(parsed_plan, f, indent=2)
        return f"Successfully saved a {weeks}-week content calendar to {calendar_path}"
    except Exception as e:
        # Fallback to saving raw string if not valid JSON
        with open(calendar_path.replace('.json', '.md'), 'w', encoding='utf-8') as f:
            f.write(plan_details)
        return f"Saved raw calendar to {calendar_path.replace('.json', '.md')} (Invalid JSON: {str(e)})"
