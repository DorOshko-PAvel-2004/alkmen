from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/documents/position")
async def get_position_document():
    """Получить документ 'положение_сл.pdf'"""
    try:
        # Путь к файлу в Docker контейнере (корень /app)
        file_path = "/app/положение_сл.pdf"
        
        # Проверяем, существует ли файл
        if not os.path.exists(file_path):
            print(f"❌ Файл не найден по пути: {file_path}")
            # Попробуем альтернативный путь
            alt_path = os.path.join(os.path.dirname(__file__), "..", "..", "положение_сл.pdf")
            alt_path = os.path.abspath(alt_path)
            print(f"❌ Пробуем альтернативный путь: {alt_path}")
            if os.path.exists(alt_path):
                file_path = alt_path
            else:
                raise HTTPException(status_code=404, detail=f"Документ не найден. Проверенные пути: {file_path}, {alt_path}")
        
        print(f"✅ Файл найден: {file_path}")
        
        # Возвращаем файл с правильным MIME типом
        return FileResponse(
            path=file_path,
            media_type="application/pdf",
            filename="position_sl.pdf",  # Используем латинское имя для совместимости
            headers={"Content-Disposition": "attachment; filename=position_sl.pdf"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Ошибка при получении документа: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении документа: {str(e)}")
