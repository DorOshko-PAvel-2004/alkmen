#!/usr/bin/env python3
"""
Скрипт создания таблиц новой схемы (заявки/формы/вопросы/ответы) в PostgreSQL.

Запуск:
  python scripts/create_new_schema.py
"""

import sys
import os

# Добавляем путь к корневой директории проекта, чтобы импортировать app.config.database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config.database import execute_query


def create_new_schema_tables():
    print("🗄️ Создание таблиц новой схемы...")

    tables_sql = [
        # Заявка
        """
        CREATE TABLE IF NOT EXISTS submissions (
            id SERIAL PRIMARY KEY,
            title VARCHAR(300) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,

        # Форма (принадлежит заявке)
        """
        CREATE TABLE IF NOT EXISTS forms (
            id SERIAL PRIMARY KEY,
            submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
            name VARCHAR(300) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,

        # Вопрос заявки
        """
        CREATE TABLE IF NOT EXISTS submission_questions (
            id SERIAL PRIMARY KEY,
            submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
            question_text TEXT NOT NULL,
            question_order INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,

        # Вопрос формы (ссылка на форму и на вопрос заявки; храним текст вопроса)
        """
        CREATE TABLE IF NOT EXISTS form_questions (
            id SERIAL PRIMARY KEY,
            form_id INTEGER NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
            submission_question_id INTEGER NOT NULL REFERENCES submission_questions(id) ON DELETE CASCADE,
            question_text TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,

        # Ответ на вопрос формы
        """
        CREATE TABLE IF NOT EXISTS form_answers (
            id SERIAL PRIMARY KEY,
            form_question_id INTEGER NOT NULL REFERENCES form_questions(id) ON DELETE CASCADE,
            answer_text TEXT,
            sha256_hash VARCHAR(64) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,

        # Участник (привязан к форме)
        """
        CREATE TABLE IF NOT EXISTS participants (
            id SERIAL PRIMARY KEY,
            form_id INTEGER NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
            last_name VARCHAR(100) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            middle_name VARCHAR(100),
            faculty VARCHAR(200),
            student_group VARCHAR(50),
            phone VARCHAR(50),
            email VARCHAR(150),
            key_competencies TEXT,
            role_in_implementation VARCHAR(200),
            sha256_hash VARCHAR(64) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,

        # Руководитель (привязан к форме)
        """
        CREATE TABLE IF NOT EXISTS supervisors (
            id SERIAL PRIMARY KEY,
            form_id INTEGER NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
            last_name VARCHAR(100) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            middle_name VARCHAR(100),
            academic_rank VARCHAR(200),
            position VARCHAR(200),
            phone VARCHAR(50),
            email VARCHAR(150),
            sha256_hash VARCHAR(64) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,
    ]

    for i, sql in enumerate(tables_sql, 1):
        execute_query(sql, fetch=False)
        print(f"  ✅ Таблица {i}/{len(tables_sql)} создана/проверена")

    print("🔍 Создание индексов...")
    indexes_sql = [
        # forms
        "CREATE INDEX IF NOT EXISTS ix_forms_submission_id ON forms(submission_id)",
        # submission_questions
        "CREATE INDEX IF NOT EXISTS ix_submission_questions_submission_id ON submission_questions(submission_id)",
        "CREATE INDEX IF NOT EXISTS ix_submission_questions_order ON submission_questions(submission_id, question_order)",
        # form_questions
        "CREATE INDEX IF NOT EXISTS ix_form_questions_form_id ON form_questions(form_id)",
        "CREATE INDEX IF NOT EXISTS ix_form_questions_submission_question_id ON form_questions(submission_question_id)",
        # form_answers
        "CREATE INDEX IF NOT EXISTS ix_form_answers_form_question_id ON form_answers(form_question_id)",
        "CREATE INDEX IF NOT EXISTS ix_form_answers_sha256 ON form_answers(sha256_hash)",

        # participants / supervisors
        "CREATE INDEX IF NOT EXISTS ix_participants_form_id ON participants(form_id)",
        "CREATE INDEX IF NOT EXISTS ix_participants_sha256 ON participants(sha256_hash)",
        "CREATE INDEX IF NOT EXISTS ix_supervisors_form_id ON supervisors(form_id)",
        "CREATE INDEX IF NOT EXISTS ix_supervisors_sha256 ON supervisors(sha256_hash)",
    ]

    for sql in indexes_sql:
        execute_query(sql, fetch=False)

    print("✅ Таблицы и индексы успешно созданы")


def main():
    try:
        create_new_schema_tables()
    except Exception as e:
        print(f"❌ Ошибка при создании новой схемы: {e}")
        raise


if __name__ == "__main__":
    main()


