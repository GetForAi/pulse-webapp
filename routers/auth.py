"""
Authentication router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models import User
from schemas import RegisterRequest, AuthResponse, UserResponse, ErrorResponse
from utils.telegram_auth import (
    verify_telegram_auth,
    parse_telegram_user_data,
    extract_hash_from_init_data
)

router = APIRouter()


@router.post(
    "/register",
    response_model=AuthResponse,
    responses={
        400: {"model": ErrorResponse},
        422: {"model": ErrorResponse}
    }
)
async def register_user(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user using Telegram WebApp data
    
    This endpoint validates the Telegram WebApp authentication data
    and creates or updates a user record in the database.
    """
    try:
        # Extract hash from user data if not provided separately
        if not request.hash:
            request.hash = extract_hash_from_init_data(request.user_data)
            
        if not request.hash:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Hash is required for authentication"
            )
        
        # Verify Telegram authentication
        if not verify_telegram_auth(request.user_data, request.hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Telegram authentication data"
            )
        
        # Parse user data from Telegram
        user_data = parse_telegram_user_data(request.user_data)
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not parse user data from Telegram"
            )
        
        telegram_id = user_data.get('id')
        if not telegram_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Telegram ID is required"
            )
        
        # Check if user already exists
        result = await db.execute(
            select(User).where(User.telegram_id == telegram_id)
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            # Update existing user
            existing_user.username = user_data.get('username')
            existing_user.first_name = user_data.get('first_name')
            existing_user.last_name = user_data.get('last_name')
            existing_user.language_code = user_data.get('language_code')
            existing_user.is_bot = user_data.get('is_bot', False)
            
            await db.commit()
            await db.refresh(existing_user)
            
            return AuthResponse(
                user=UserResponse.model_validate(existing_user),
                message="User updated successfully"
            )
        else:
            # Create new user
            new_user = User(
                telegram_id=telegram_id,
                username=user_data.get('username'),
                first_name=user_data.get('first_name'),
                last_name=user_data.get('last_name'),
                language_code=user_data.get('language_code'),
                is_bot=user_data.get('is_bot', False)
            )
            
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)
            
            return AuthResponse(
                user=UserResponse.model_validate(new_user),
                message="User registered successfully"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get(
    "/me",
    response_model=UserResponse,
    responses={
        404: {"model": ErrorResponse}
    }
)
async def get_current_user(
    telegram_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get current user information by Telegram ID
    
    This endpoint retrieves user information from the database
    using the provided Telegram ID.
    """
    try:
        result = await db.execute(
            select(User).where(User.telegram_id == telegram_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse.model_validate(user)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
