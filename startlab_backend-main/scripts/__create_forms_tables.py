#!/usr/bin/env python3
"""
Скрипт для создания таблиц форм и вопросов в PostgreSQL
Создает таблицы: вопросы, формы, вопросы формы, ответы на форму
"""

import sys
import os

# Добавляем путь к корневой директории проекта
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config.database import execute_query

def create_forms_tables():
    """Создает таблицы для системы форм и вопросов"""
    print("🗄️ Создание таблиц для системы форм и вопросов...")
    
    # SQL команды для создания таблиц
    tables_sql = [
        
        # Таблица вопросов
        """
        CREATE TABLE IF NOT EXISTS questions (
            id SERIAL PRIMARY KEY,
            question_text TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,
        
        # Таблица форм
        """
        CREATE TABLE IF NOT EXISTS forms (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,
        
        # Таблица вопросов формы (связующая таблица)
        """
        CREATE TABLE IF NOT EXISTS form_questions (
            id SERIAL PRIMARY KEY,
            form_id INTEGER NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
            question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            question_order INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            UNIQUE(form_id, question_id),
            UNIQUE(form_id, question_order)
        )
        """,
        
        # Таблица ответов на форму
        """
        CREATE TABLE IF NOT EXISTS form_answers (
            id SERIAL PRIMARY KEY,
            sha256_hash VARCHAR(64) NOT NULL,
            form_question_id INTEGER NOT NULL REFERENCES form_questions(id) ON DELETE CASCADE,
            answer_txt TEXT,
            answer_docx BYTEA,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """
    ]
    
    try:
        # Создаем каждую таблицу
        for i, sql in enumerate(tables_sql, 1):
            table_names = ["questions", "forms", "form_questions", "form_answers"]
            print(f"📋 Создание таблицы {table_names[i-1]} ({i}/{len(tables_sql)})...")
            execute_query(sql, fetch=False)
        
        print("✅ Все таблицы успешно созданы!")
        
        # Создаем индексы для улучшения производительности
        print("🔍 Создание индексов...")
        indexes_sql = [
            "CREATE INDEX IF NOT EXISTS ix_form_questions_form_id ON form_questions(form_id)",
            "CREATE INDEX IF NOT EXISTS ix_form_questions_question_id ON form_questions(question_id)",
            "CREATE INDEX IF NOT EXISTS ix_form_questions_order ON form_questions(form_id, question_order)",
            "CREATE INDEX IF NOT EXISTS ix_form_answers_sha256 ON form_answers(sha256_hash)",
            "CREATE INDEX IF NOT EXISTS ix_form_answers_form_question_id ON form_answers(form_question_id)",
            "CREATE INDEX IF NOT EXISTS ix_questions_created_at ON questions(created_at)",
            "CREATE INDEX IF NOT EXISTS ix_forms_created_at ON forms(created_at)"
        ]
        
        for index_sql in indexes_sql:
            execute_query(index_sql, fetch=False)
        
        print("✅ Все индексы успешно созданы!")
        
        # Добавляем тестовые данные
        print("📝 Добавление тестовых данных...")
        add_test_data()
        
        # Выводим информацию о созданных таблицах
        print("\n📊 Созданные таблицы:")
        print("1. questions - таблица вопросов (id, question_text)")
        print("2. forms - таблица форм (id, name)")
        print("3. form_questions - связующая таблица (id, form_id, question_id, question_order)")
        print("4. form_answers - таблица ответов (id, sha256_hash, form_question_id, answer_txt, answer_docx)")
        
    except Exception as e:
        print(f"❌ Ошибка при создании таблиц: {e}")
        import traceback
        print(f"🔍 Traceback: {traceback.format_exc()}")
        raise

def add_test_data():
    """Добавляет тестовые данные в таблицы"""
    try:
        # Очищаем существующие тестовые данные
        print("🧹 Очистка существующих тестовых данных...")
        execute_query("DELETE FROM form_answers", fetch=False)
        execute_query("DELETE FROM form_questions", fetch=False)
        execute_query("DELETE FROM questions", fetch=False)
        execute_query("DELETE FROM forms", fetch=False)
        
        # Добавляем формы
        print("📋 Добавление тестовых форм...")
        forms_data = [
            "Анкета участника СТАРТЛАБ",
            "Оценка проекта"
        ]
        
        for form_name in forms_data:
            execute_query(
                "INSERT INTO forms (name) VALUES (%s)",
                (form_name,),
                fetch=False
            )
        
        # Добавляем вопросы
        print("❓ Добавление тестовых вопросов...")
        questions_data = [
            # Вопросы для первой формы (Анкета участника)
            "Как вас зовут?",
            "Какой у вас опыт программирования?",
            "В какой области вы хотели бы развиваться?",
            "Есть ли у вас опыт работы в команде?",
            "Какие технологии вас интересуют?",
            
            # Вопросы для второй формы (Оценка проекта)
            "Оцените сложность проекта по шкале от 1 до 10",
            "Сколько времени потребовалось на выполнение?",
            "Какие были основные трудности?",
            "Что понравилось больше всего?",
            "Рекомендуете ли вы этот проект другим?"
        ]
        
        for question_text in questions_data:
            execute_query(
                "INSERT INTO questions (question_text) VALUES (%s)",
                (question_text,),
                fetch=False
            )
        
        # Связываем вопросы с формами
        print("🔗 Связывание вопросов с формами...")
        
        # Получаем ID форм
        forms_result = execute_query("SELECT id FROM forms ORDER BY id")
        form_ids = [row['id'] for row in forms_result]
        
        # Получаем ID вопросов
        questions_result = execute_query("SELECT id FROM questions ORDER BY id")
        question_ids = [row['id'] for row in questions_result]
        
        # Связываем вопросы с первой формой (первые 5 вопросов)
        for i, question_id in enumerate(question_ids[:5], 1):
            execute_query(
                "INSERT INTO form_questions (form_id, question_id, question_order) VALUES (%s, %s, %s)",
                (form_ids[0], question_id, i),
                fetch=False
            )
        
        # Связываем вопросы со второй формой (следующие 5 вопросов)
        for i, question_id in enumerate(question_ids[5:], 1):
            execute_query(
                "INSERT INTO form_questions (form_id, question_id, question_order) VALUES (%s, %s, %s)",
                (form_ids[1], question_id, i),
                fetch=False
            )
        
        print("✅ Тестовые данные успешно добавлены!")
        
        # Выводим статистику
        forms_count = execute_query("SELECT COUNT(*) as count FROM forms")[0]['count']
        questions_count = execute_query("SELECT COUNT(*) as count FROM questions")[0]['count']
        form_questions_count = execute_query("SELECT COUNT(*) as count FROM form_questions")[0]['count']
        
        print(f"📊 Статистика:")
        print(f"  - Форм: {forms_count}")
        print(f"  - Вопросов: {questions_count}")
        print(f"  - Связей вопрос-форма: {form_questions_count}")
        
    except Exception as e:
        print(f"❌ Ошибка при добавлении тестовых данных: {e}")
        import traceback
        print(f"🔍 Traceback: {traceback.format_exc()}")
        raise

def verify_tables():
    """Проверяет, что все таблицы созданы корректно"""
    print("\n🔍 Проверка созданных таблиц...")
    
    try:
        # Проверяем существование таблиц
        check_tables_sql = """
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('questions', 'forms', 'form_questions', 'form_answers')
        ORDER BY table_name
        """
        
        result = execute_query(check_tables_sql)
        existing_tables = [row['table_name'] for row in result]
        
        expected_tables = ['questions', 'forms', 'form_questions', 'form_answers']
        
        print("📋 Найденные таблицы:")
        for table in existing_tables:
            print(f"  ✅ {table}")
        
        missing_tables = set(expected_tables) - set(existing_tables)
        if missing_tables:
            print(f"❌ Отсутствующие таблицы: {', '.join(missing_tables)}")
            return False
        else:
            print("✅ Все таблицы созданы успешно!")
            return True
            
    except Exception as e:
        print(f"❌ Ошибка при проверке таблиц: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Запуск создания таблиц для системы форм и вопросов...")
    print("=" * 60)
    
    try:
        create_forms_tables()
        verify_tables()
        print("\n🎉 Скрипт выполнен успешно!")
        
    except Exception as e:
        print(f"\n💥 Критическая ошибка: {e}")
        sys.exit(1)
