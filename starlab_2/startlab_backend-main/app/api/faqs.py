from fastapi import APIRouter, HTTPException
from ..crud.crud import get_faqs, get_faq
import os

router = APIRouter(prefix="/faqs", tags=["faqs"])

def get_image_url(image_path: str) -> str:
    """Преобразует путь к изображению в полный URL"""
    if not image_path:
        return None
    
    # Если это уже полный URL, возвращаем как есть
    if image_path.startswith('http'):
        return image_path
    
    # Иначе добавляем базовый URL
    base_url = os.getenv("MEDIA_BASE_URL", "http://bsuir.stacklevel.group/media/")
    return f"{base_url}{image_path}"

@router.get("/")
async def get_faqs_endpoint():
    """Получить все FAQ"""
    try:
        faqs = get_faqs()
        print(f"✅ Получено {len(faqs)} FAQ из базы данных")
        
        # Преобразуем пути к изображениям в полные URL
        for faq in faqs:
            if faq.get('image'):
                faq['imageUrl'] = get_image_url(faq['image'])
            else:
                faq['imageUrl'] = None
        
        return faqs
    except Exception as e:
        print(f"❌ Ошибка при получении FAQ: {e}")
        import traceback
        print(f"🔍 Полный traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{faq_id}")
async def get_faq_endpoint(faq_id: int):
    """Получить FAQ по ID"""
    try:
        faq = get_faq(faq_id)
        if not faq:
            raise HTTPException(status_code=404, detail="FAQ not found")
        
        # Преобразуем путь к изображению в полный URL
        if faq.get('image'):
            faq['imageUrl'] = get_image_url(faq['image'])
        else:
            faq['imageUrl'] = None
            
        return faq
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Ошибка при получении FAQ: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
