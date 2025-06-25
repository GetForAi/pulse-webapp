"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TelegramUserData(BaseModel):
    """Schema for Telegram user data from WebApp"""
    id: int = Field(..., description="Telegram user ID")
    first_name: Optional[str] = Field(None, description="User's first name")
    last_name: Optional[str] = Field(None, description="User's last name")
    username: Optional[str] = Field(None, description="User's username")
    language_code: Optional[str] = Field(None, description="User's language code")
    is_bot: Optional[bool] = Field(False, description="Whether user is a bot")


class RegisterRequest(BaseModel):
    """Schema for user registration request"""
    user_data: str = Field(..., description="Telegram WebApp init data")
    hash: str = Field(..., description="Data hash for verification")


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    telegram_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_bot: bool = False
    language_code: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """Schema for authentication response"""
    user: UserResponse
    message: str = "Authentication successful"


class ErrorResponse(BaseModel):
    """Schema for error response"""
    detail: str
    error_code: Optional[str] = None
