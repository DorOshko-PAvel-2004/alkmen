from ..config.database import execute_query
from ..models.models import create_tables

def seed_faqs():
    """Заполняет FAQ тестовыми данными"""
    faqs_data = [
        {
            "question": "Что такое СТАРТЛАБ?",
            "answer": "СТАРТЛАБ - это конкурс инновационных проектов для студентов и школьников, направленный на развитие предпринимательских навыков и поддержку инновационных идей.",
            "order": 1
        },
        {
            "question": "Кто может участвовать в конкурсе?",
            "answer": "В конкурсе могут участвовать студенты высших учебных заведений и школьники старших классов, объединенные в команды от 2 до 5 человек.",
            "order": 2
        },
        {
            "question": "Какие проекты принимаются на конкурс?",
            "answer": "Принимаются инновационные проекты в различных областях: IT, медицина, экология, образование, социальные проекты и другие.",
            "order": 3
        }
    ]
    
    for faq in faqs_data:
        query = """
            INSERT INTO faqs (question, answer, "order", is_active, created_at)
            VALUES (%s, %s, %s, true, NOW())
            ON CONFLICT DO NOTHING
        """
        execute_query(query, (faq["question"], faq["answer"], faq["order"]), fetch=False)
    
    print("✅ FAQ заполнены тестовыми данными")

def seed_project_stages():
    """Заполняет этапы проекта тестовыми данными"""
    stages_data = [
        {
            "name": "Регистрация",
            "description": "Подача заявок на участие в конкурсе",
            "order": 1
        },
        {
            "name": "Отборочный тур",
            "description": "Оценка проектов экспертами",
            "order": 2
        },
        {
            "name": "Полуфинал",
            "description": "Презентация проектов перед жюри",
            "order": 3
        },
        {
            "name": "Финал",
            "description": "Финальная защита проектов",
            "order": 4
        }
    ]
    
    for stage in stages_data:
        query = """
            INSERT INTO project_stages (name, description, "order", is_active, created_at)
            VALUES (%s, %s, %s, true, NOW())
            ON CONFLICT DO NOTHING
        """
        execute_query(query, (stage["name"], stage["description"], stage["order"]), fetch=False)
    
    print("✅ Этапы проекта заполнены тестовыми данными")

def seed_contacts():
    """Заполняет контакты тестовыми данными"""
    contacts_data = [
        {
            "type": "email",
            "title": "Email",
            "value": "startlab@bsuir.by",
            "icon": "📧",
            "order": 1
        },
        {
            "type": "phone",
            "title": "Телефон",
            "value": "+375 (17) 293-21-21",
            "icon": "📞",
            "order": 2
        },
        {
            "type": "address",
            "title": "Адрес",
            "value": "г. Минск, ул. Петруся Бровки, 4",
            "icon": "📍",
            "order": 3
        }
    ]
    
    for contact in contacts_data:
        query = """
            INSERT INTO contacts (type, title, value, icon, "order", is_active, created_at)
            VALUES (%s, %s, %s, %s, %s, true, NOW())
            ON CONFLICT DO NOTHING
        """
        execute_query(query, (
            contact["type"], contact["title"], contact["value"], 
            contact["icon"], contact["order"]
        ), fetch=False)
    
    print("✅ Контакты заполнены тестовыми данными")

def seed_partners():
    """Заполняет партнеров тестовыми данными"""
    partners_data = [
        {
            "name": "Белорусский государственный университет информатики и радиоэлектроники",
            "package": "gold",
            "description": "Ведущий технический университет Беларуси",
            "website": "https://www.bsuir.by",
            "order": 1
        },
        {
            "name": "Парк высоких технологий",
            "package": "gold",
            "description": "Крупнейший IT-кластер в регионе",
            "website": "https://www.park.by",
            "order": 2
        }
    ]
    
    for partner in partners_data:
        query = """
            INSERT INTO partners (name, package, description, website, "order", is_active, created_at)
            VALUES (%s, %s, %s, %s, %s, true, NOW())
            ON CONFLICT DO NOTHING
        """
        execute_query(query, (
            partner["name"], partner["package"], partner["description"], 
            partner["website"], partner["order"]
        ), fetch=False)
    
    print("✅ Партнеры заполнены тестовыми данными")

def main():
    """Основная функция для заполнения базы данных"""
    print("🌱 Заполнение базы данных тестовыми данными...")
    
    try:
        # Создаем таблицы если их нет
        create_tables()
        
        # Заполняем данными
        seed_faqs()
        seed_project_stages()
        seed_contacts()
        seed_partners()
        
        print("✅ База данных успешно заполнена тестовыми данными!")
        
    except Exception as e:
        print(f"❌ Ошибка при заполнении базы данных: {e}")
        raise

if __name__ == "__main__":
    main()

