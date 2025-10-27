from fastapi import APIRouter, HTTPException
from ..crud.crud import get_news, get_news_item
import os

router = APIRouter(prefix="/news", tags=["news"])

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
async def get_news_endpoint():
    """Получить все новости"""
    try:
        news = get_news()
        print(f"✅ Получено {len(news)} новостей из базы данных")
        
        # Преобразуем пути к изображениям в полные URL
        for item in news:
            if item.get('image'):
                item['imageUrl'] = get_image_url(item['image'])
            else:
                item['imageUrl'] = None
        
        return news
    except Exception as e:
        print(f"❌ Ошибка при получении новостей: {e}")
        import traceback
        print(f"🔍 Полный traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{news_id}")
async def get_news_item_endpoint(news_id: int):
    """Получить новость по ID"""
    try:
        news = get_news_item(news_id)
        if not news:
            raise HTTPException(status_code=404, detail="News not found")
        
        # Преобразуем путь к изображению в полный URL
        if news.get('image'):
            news['imageUrl'] = get_image_url(news['image'])
        else:
            news['imageUrl'] = None
            
        return news
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Ошибка при получении новости: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

