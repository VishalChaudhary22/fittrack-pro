def generate_caption(brief: str, platform: str) -> str:
    """
    Generates a platform-optimized caption. This relies on the agent's LLM generation 
    capabilities but provides a structured wrapper.
    
    Args:
        brief (str): The content brief for the caption.
        platform (str): The target platform (e.g., 'Instagram', 'X').
    """
    return f"Caption generated for {platform} based on brief: '{brief}'. Make sure you rewrite this nicely!"

def generate_hashtags(topic: str, platform: str) -> str:
    """
    Generates relevant hashtags for a post.
    
    Args:
        topic (str): The main topic of the post.
        platform (str): The target platform.
    """
    return f"#KaayaFit #Sankalp #{topic.replace(' ', '')} #FitnessIndia"

def generate_image_prompt(brief: str) -> str:
    """
    Creates a detailed image generation prompt based on a creative brief.
    
    Args:
        brief (str): The visual concept.
    """
    return f"Premium cinematic fitness photography, {brief}, dynamic lighting, dark aesthetic, orange highlights, 8k resolution, photorealistic"
