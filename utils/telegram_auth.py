"""
Telegram WebApp authentication utilities
"""

import hashlib
import hmac
import json
import os
from urllib.parse import unquote, parse_qsl
from typing import Dict, Optional
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")


def verify_telegram_auth(auth_data: str, received_hash: str) -> bool:
    """
    Verify Telegram WebApp authentication data
    
    Args:
        auth_data: Raw authentication data from Telegram WebApp
        received_hash: Hash received from client
        
    Returns:
        bool: True if authentication is valid, False otherwise
    """
    if not BOT_TOKEN:
        raise ValueError("BOT_TOKEN is not set in environment variables")
    
    try:
        # Parse the auth data
        parsed_data = dict(parse_qsl(auth_data))
        
        # Remove hash from data for verification
        if 'hash' in parsed_data:
            del parsed_data['hash']
        
        # Create data string for verification
        data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted(parsed_data.items())])
        
        # Create secret key
        secret_key = hmac.new(
            "WebAppData".encode(),
            BOT_TOKEN.encode(),
            hashlib.sha256
        ).digest()
        
        # Calculate hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return calculated_hash == received_hash
        
    except Exception as e:
        print(f"Error verifying Telegram auth: {e}")
        return False


def parse_telegram_user_data(auth_data: str) -> Optional[Dict]:
    """
    Parse user data from Telegram WebApp authentication data
    
    Args:
        auth_data: Raw authentication data from Telegram WebApp
        
    Returns:
        Dict: Parsed user data or None if parsing fails
    """
    try:
        parsed_data = dict(parse_qsl(auth_data))
        
        if 'user' not in parsed_data:
            return None
            
        user_data = json.loads(unquote(parsed_data['user']))
        return user_data
        
    except Exception as e:
        print(f"Error parsing Telegram user data: {e}")
        return None


def extract_hash_from_init_data(init_data: str) -> Optional[str]:
    """
    Extract hash from Telegram WebApp init data
    
    Args:
        init_data: Telegram WebApp init data string
        
    Returns:
        str: Extracted hash or None if not found
    """
    try:
        parsed_data = dict(parse_qsl(init_data))
        return parsed_data.get('hash')
    except Exception:
        return None
