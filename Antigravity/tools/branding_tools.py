import os
import json
from datetime import datetime

def load_brand_guidelines() -> str:
    """
    Loads and returns the brand identity JSON document for review.
    """
    guidelines_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'brand_guidelines.json')
    try:
        with open(guidelines_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error loading brand guidelines: {str(e)}"

def check_forbidden_terms(text: str) -> str:
    """
    Checks text for forbidden brand terms like 'FitTrack', 'bet', 'gamble', etc.
    
    Args:
        text (str): The content to review.
    """
    guidelines_raw = load_brand_guidelines()
    try:
        guidelines = json.loads(guidelines_raw)
        forbidden = guidelines.get("forbidden_terms", [])
        preferred = guidelines.get("preferred_terms", {})
        
        found_issues = []
        lower_text = text.lower()
        
        for term in forbidden:
            if term.lower() in lower_text:
                found_issues.append(f"Forbidden term used: '{term}'")
                
        # Specific suggestions
        if "fittrack" in lower_text:
            found_issues.append("Replace 'FitTrack' with 'Kaaya Fit'")
        if "fitpact" in lower_text:
            found_issues.append("Replace 'FitPact' with 'Sankalp'")
            
        if found_issues:
            return "ISSUES FOUND:\n- " + "\n- ".join(found_issues)
        return "PASS: No forbidden terms found."
    except Exception as e:
        return f"Error checking terms: {str(e)}"
