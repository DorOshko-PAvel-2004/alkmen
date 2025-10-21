from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Partner схемы
class PartnerBase(BaseModel):
    name: str
    title: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    is_active: bool = True

class Partner(PartnerBase):
    id: int
    logoUrl: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# FAQ схемы
class FAQBase(BaseModel):
    question: str
    answer: str
    order: int
    is_active: bool = True
    image_url: Optional[str] = None

class FAQ(FAQBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Новостные схемы
class NewsBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    is_active: bool = True

class News(NewsBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

"""Удалены схемы, связанные с формами, вопросами и заявками"""

 