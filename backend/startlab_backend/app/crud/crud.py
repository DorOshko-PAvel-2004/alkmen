from ..config.database import execute_query, execute_single_query
from typing import List, Dict, Any

# Partner функции
def get_partners() -> List[Dict[str, Any]]:
    """Получить всех партнеров"""
    try:
        query = """
            SELECT id, name, title, logo, description, website, is_active, created_at
            FROM partners 
            WHERE is_active = true 
            ORDER BY name
        """
        print(f"🔍 Выполняем запрос партнеров: {query}")
        
        result = execute_query(query)
        print(f"🔍 Результат execute_query для партнеров: {result}")
        
        if result is None:
            print("🔍 Результат None, возвращаем []")
            return []
        
        if len(result) == 0:
            print("🔍 Результат пустой, возвращаем []")
            return []
        
        # Преобразуем в список словарей
        cleaned_result = []
        for i, row in enumerate(result):
            print(f"🔍 Обрабатываем партнера {i}: {row}")
            
            if isinstance(row, dict):
                print(f"🔍 Партнер уже словарь: {row}")
                # Добавляем URL для логотипа
                if row.get('logo'):
                    row['logo_url'] = f"/media/{row['logo']}"
                cleaned_result.append(row)
            else:
                print(f"🔍 Партнер не словарь, создаем словарь")
                cleaned_row = {
                    'id': getattr(row, 'id', None),
                    'name': getattr(row, 'name', ''),
                    'title': getattr(row, 'title', None),
                    'description': getattr(row, 'description', None),
                    'website': getattr(row, 'website', None),
                    'is_active': getattr(row, 'is_active', True),
                    'created_at': getattr(row, 'created_at', None)
                }
                # Добавляем URL для логотипа
                logo = getattr(row, 'logo', None)
                if logo:
                    cleaned_row['logo_url'] = f"/media/{logo}"
                print(f"🔍 Созданный словарь партнера: {cleaned_row}")
                cleaned_result.append(cleaned_row)
        
        print(f"🔍 Финальный результат партнеров: {cleaned_result}")
        return cleaned_result
    except Exception as e:
        print(f"❌ Ошибка в get_partners: {e}")
        import traceback
        print(f"🔍 Traceback: {traceback.format_exc()}")
        return []

def get_partner(partner_id: int) -> Dict[str, Any]:
    """Получить партнера по ID"""
    query = """
        SELECT id, name, title, logo, description, website, is_active, created_at
        FROM partners 
        WHERE id = %s AND is_active = true
    """
    result = execute_single_query(query, (partner_id,))
    if result and result.get('logo'):
        result['logo_url'] = f"/media/{result['logo']}"
    return result

# FAQ функции
def get_faqs() -> List[Dict[str, Any]]:
    """Получить все FAQ"""
    try:
        query = """
            SELECT id, question, answer, "order", is_active, image, created_at
            FROM faqs 
            WHERE is_active = true 
            ORDER BY "order"
        """
        print(f"🔍 Выполняем запрос: {query}")
        
        result = execute_query(query)
        print(f"🔍 Результат execute_query: {result}")
        print(f"🔍 Тип результата: {type(result)}")
        print(f"🔍 Длина результата: {len(result) if result else 0}")
        
        # Простая обработка результата
        if result is None:
            print("🔍 Результат None, возвращаем []")
            return []
        
        if len(result) == 0:
            print("🔍 Результат пустой, возвращаем []")
            return []
        
        # Преобразуем в список словарей
        cleaned_result = []
        for i, row in enumerate(result):
            print(f"🔍 Обрабатываем строку {i}: {row}")
            print(f"🔍 Тип строки: {type(row)}")
            
            if isinstance(row, dict):
                print(f"🔍 Строка уже словарь: {row}")
                # Просто добавляем строку как есть, кодировка исправлена на уровне подключения
                cleaned_result.append(row)
            else:
                # Если row не словарь, создаем словарь
                print(f"🔍 Строка не словарь, создаем словарь")
                cleaned_row = {
                    'id': getattr(row, 'id', None),
                    'question': getattr(row, 'question', ''),
                    'answer': getattr(row, 'answer', ''),
                    'order': getattr(row, 'order', 0),
                    'is_active': getattr(row, 'is_active', True),
                    'created_at': getattr(row, 'created_at', None)
                }
                print(f"🔍 Созданный словарь: {cleaned_row}")
                cleaned_result.append(cleaned_row)
        
        print(f"🔍 Финальный результат: {cleaned_result}")
        return cleaned_result
    except Exception as e:
        print(f"❌ Ошибка в get_faqs: {e}")
        import traceback
        print(f"🔍 Traceback: {traceback.format_exc()}")
        return []

def get_faq(faq_id: int) -> Dict[str, Any]:
    """Получить FAQ по ID"""
    query = """
        SELECT id, question, answer, "order", is_active, image, created_at
        FROM faqs 
        WHERE id = %s AND is_active = true
    """
    return execute_single_query(query, (faq_id,))



# News функции
def get_news() -> List[Dict[str, Any]]:
    """Получить все новости"""
    try:
        query = """
            SELECT id, title, content, image, is_active, created_at, updated_at
            FROM news 
            WHERE is_active = true 
            ORDER BY created_at DESC
        """
        print(f"🔍 Выполняем запрос новостей: {query}")
        
        result = execute_query(query)
        print(f"🔍 Результат execute_query для новостей: {result}")
        
        if result is None:
            print("🔍 Результат None, возвращаем []")
            return []
        
        if len(result) == 0:
            print("🔍 Результат пустой, возвращаем []")
            return []
        
        # Преобразуем в список словарей
        cleaned_result = []
        for i, row in enumerate(result):
            print(f"🔍 Обрабатываем новость {i}: {row}")
            
            if isinstance(row, dict):
                print(f"🔍 Новость уже словарь: {row}")
                cleaned_result.append(row)
            else:
                print(f"🔍 Новость не словарь, создаем словарь")
                cleaned_row = {
                    'id': getattr(row, 'id', None),
                    'title': getattr(row, 'title', ''),
                    'content': getattr(row, 'content', ''),
                    'image_url': getattr(row, 'image_url', None),
                    'is_active': getattr(row, 'is_active', True),
                    'created_at': getattr(row, 'created_at', None),
                    'updated_at': getattr(row, 'updated_at', None)
                }
                print(f"🔍 Созданный словарь новости: {cleaned_row}")
                cleaned_result.append(cleaned_row)
        
        print(f"🔍 Финальный результат новостей: {cleaned_result}")
        return cleaned_result
    except Exception as e:
        print(f"❌ Ошибка в get_news: {e}")
        import traceback
        print(f"🔍 Traceback: {traceback.format_exc()}")
        return []

def get_news_item(news_id: int) -> Dict[str, Any]:
    """Получить новость по ID"""
    query = """
        SELECT id, title, content, image, is_active, created_at, updated_at
        FROM news 
        WHERE id = %s AND is_active = true
    """
    return execute_single_query(query, (news_id,))
