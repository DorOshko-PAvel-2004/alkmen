from fastapi import APIRouter, HTTPException
from typing import List
from ..crud.crud import get_partners, get_partner
from ..schemas.schemas import Partner

router = APIRouter()

@router.get("/partners", response_model=List[Partner])
async def get_all_partners():
    """Получить всех партнеров"""
    try:
        partners_data = get_partners()
        if not partners_data:
            return []
        
        # Преобразуем данные в объекты Partner
        partners = []
        for partner_data in partners_data:
            partner = Partner(
                id=partner_data['id'],
                name=partner_data['name'],
                title=partner_data.get('title'),
                description=partner_data.get('description'),
                website=partner_data.get('website'),
                is_active=partner_data.get('is_active', True),
                logoUrl=partner_data.get('logo_url'),
                created_at=partner_data.get('created_at')
            )
            partners.append(partner)
        
        return partners
    except Exception as e:
        print(f"❌ Ошибка в get_all_partners: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении партнеров")

@router.get("/partners/{partner_id}", response_model=Partner)
async def get_partner_by_id(partner_id: int):
    """Получить партнера по ID"""
    try:
        partner_data = get_partner(partner_id)
        if not partner_data:
            raise HTTPException(status_code=404, detail="Партнер не найден")
        
        partner = Partner(
            id=partner_data['id'],
            name=partner_data['name'],
            title=partner_data.get('title'),
            description=partner_data.get('description'),
            website=partner_data.get('website'),
            is_active=partner_data.get('is_active', True),
            logoUrl=partner_data.get('logo_url'),
            created_at=partner_data.get('created_at')
        )
        
        return partner
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Ошибка в get_partner_by_id: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении партнера")
