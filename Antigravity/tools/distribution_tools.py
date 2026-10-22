import json
import os
import time

def get_optimal_post_time(platform: str, day: str) -> str:
    """
    Returns best IST posting window based on Indian audience data.
    
    Args:
        platform (str): 'Instagram' or 'X'
        day (str): Day of the week.
    """
    return "19:00 IST" # Simplified for Phase 1

def save_content_package(package_json: str) -> str:
    """
    Saves a ready-to-post content package to the assets directory.
    
    Args:
        package_json (str): A JSON string containing 'platform', 'caption', 'image_prompt', 'scheduled_time'.
    """
    assets_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'assets')
    os.makedirs(assets_dir, exist_ok=True)
    
    try:
        data = json.loads(package_json)
        timestamp = int(time.time())
        filename = f"post_{data.get('platform', 'unknown')}_{timestamp}.json"
        filepath = os.path.join(assets_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
            
        return f"Successfully saved content package to {filepath}"
    except Exception as e:
        return f"Failed to save package (invalid JSON?): {str(e)}"
