#!/usr/bin/env python3
"""
Create database (if needed) and all application tables with foreign keys.

Reads configuration strictly from environment (.env), supporting POSTGRES_* (preferred)
and DB_* (fallback) variables.
"""

import os
import sys
import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv


def get_env_value(primary_key: str, fallback_key: str | None = None) -> str:
    value = os.getenv(primary_key)
    if not value and fallback_key:
        value = os.getenv(fallback_key)
    if not value:
        raise ValueError(f"Missing env var: {primary_key}" + (f" or {fallback_key}" if fallback_key else ""))
    return value


def ensure_database_exists(host: str, port: int, admin_user: str, admin_password: str, database_name: str) -> None:
    conn = psycopg2.connect(host=host, port=port, dbname="postgres", user=admin_user, password=admin_password)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)  # CREATE DATABASE требует autocommit
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (database_name,))
            exists = cur.fetchone() is not None
            if not exists:
                cur.execute(
                    sql.SQL("CREATE DATABASE {}").format(sql.Identifier(database_name))
                )
                print(f"✅ Database created: {database_name}")
            else:
                print(f"ℹ️ Database already exists: {database_name}")
    finally:
        conn.close()

def create_tables(host: str, port: int, dbname: str, user: str, password: str) -> None:
    conn = psycopg2.connect(host=host, port=port, dbname=dbname, user=user, password=password)
    try:
        with conn.cursor() as cur:
            # Core content tables used by API/admin
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS faqs (
                    id SERIAL PRIMARY KEY,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    "order" INTEGER NOT NULL,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    image_url TEXT,
                    image VARCHAR(255)
                );
                """
            )

            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS news (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    is_active BOOLEAN,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP,
                    image VARCHAR(255)
                );
                """
            )

            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS partners (
                    id BIGSERIAL PRIMARY KEY,
                    name VARCHAR(200) NOT NULL,
                    logo VARCHAR(255),
                    description TEXT,
                    website VARCHAR(255),
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    title VARCHAR(200)
                );
                """
            )

            # Submissions/forms domain (with Django-compatible FK names *_id)
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS submissions (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(300) NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                );
                """
            )

            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS forms (
                    id SERIAL PRIMARY KEY,
                    submission_id INTEGER NOT NULL,
                    name VARCHAR(300) NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    CONSTRAINT fk_forms_submission
                        FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
                );
                """
            )

            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS submission_questions (
                    id SERIAL PRIMARY KEY,
                    submission_id INTEGER NOT NULL,
                    question_text TEXT NOT NULL,
                    question_order INTEGER NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    CONSTRAINT fk_submission_questions_submission
                        FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
                );
                """
            )

            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS form_questions (
                    id SERIAL PRIMARY KEY,
                    form_id INTEGER NOT NULL,
                    submission_question_id INTEGER NOT NULL,
                    question_text TEXT NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    CONSTRAINT fk_form_questions_form
                        FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
                    CONSTRAINT fk_form_questions_submission_question
                        FOREIGN KEY (submission_question_id) REFERENCES submission_questions(id) ON DELETE CASCADE
                );
                """
            )

            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS form_answers (
                    id SERIAL PRIMARY KEY,
                    form_question_id INTEGER NOT NULL,
                    answer_text TEXT,
                    sha256_hash VARCHAR(64) NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    CONSTRAINT fk_form_answers_form_question
                        FOREIGN KEY (form_question_id) REFERENCES form_questions(id) ON DELETE CASCADE
                );
                """
            )

            # Additional entities present in your schema
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS participants (
                    id SERIAL PRIMARY KEY,
                    form_id INTEGER NOT NULL,
                    last_name VARCHAR(255) NOT NULL,
                    first_name VARCHAR(255) NOT NULL,
                    middle_name VARCHAR(255),
                    faculty VARCHAR(255),
                    student_group VARCHAR(255),
                    phone VARCHAR(255),
                    email VARCHAR(255),
                    key_competencies TEXT,
                    role_in_implementation VARCHAR(255),
                    sha256_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    CONSTRAINT fk_participants_form
                        FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
                );
                """
            )

            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS supervisors (
                    id SERIAL PRIMARY KEY,
                    form_id INTEGER NOT NULL,
                    last_name VARCHAR(255) NOT NULL,
                    first_name VARCHAR(255) NOT NULL,
                    middle_name VARCHAR(255),
                    academic_rank VARCHAR(255),
                    position VARCHAR(255),
                    phone VARCHAR(255),
                    email VARCHAR(255),
                    sha256_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    CONSTRAINT fk_supervisors_form
                        FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
                );
                """
            )

            # Answers table requested
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS answers (
                    id SERIAL PRIMARY KEY,
                    "title" TEXT,
                    "relevance" TEXT,
                    "goal" TEXT,
                    "tasks" TEXT,
                    "description" TEXT,
                    "expectedResults" TEXT,
                    "marketAssessment" TEXT,
                    "competitionAnalysis" TEXT,
                    "budgetBYN" TEXT,
                    "timeline" TEXT,
                    "label" TEXT,
                    "url" TEXT,
                    "additionalInfo" TEXT,
                    "sha256" VARCHAR(64)
                );
                """
            )

            # Team members table (array-like structure)
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS team (
                    id SERIAL PRIMARY KEY,
                    "lastName" VARCHAR(255) NOT NULL,
                    "firstName" VARCHAR(255) NOT NULL,
                    "middleName" VARCHAR(255),
                    "faculty" VARCHAR(255),
                    "group" VARCHAR(255),
                    "phone" VARCHAR(255),
                    "email" VARCHAR(255),
                    "keySkills" TEXT,
                    "role" VARCHAR(255),
                    "sha256" VARCHAR(64)
                );
                """
            )

            # Second supervisor table
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS supervisor_2 (
                    id SERIAL PRIMARY KEY,
                    "fullName" VARCHAR(255),
                    "academicTitle" VARCHAR(255),
                    "position" VARCHAR(255),
                    "phone" VARCHAR(255),
                    "email" VARCHAR(255),
                    "sha256" VARCHAR(64)
                );
                """
            )

            # answer_2 table for startup payloads
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS answer_2 (
                    id SERIAL PRIMARY KEY,
                    "title" TEXT,
                    "problemStatementShort" TEXT,
                    "goal" TEXT,
                    "stageAndNextSteps" TEXT,
                    "description" TEXT,
                    "founderMotivationAndExpertise" TEXT,
                    "expectedResults" TEXT,
                    "benefitForBelarus" TEXT,
                    "marketAssessment" TEXT,
                    "monetization" TEXT,
                    "competitionAnalysis" TEXT,
                    "budgetBYN" TEXT,
                    "needsInvestmentNow" TEXT,
                    "timeline" TEXT,
                    "label" TEXT,
                    "url" TEXT,
                    "additionalInfo" TEXT,
                    "sha256" VARCHAR(64)
                );
                """
            )

            # Helpful indexes
            cur.execute('CREATE INDEX IF NOT EXISTS ix_faqs_order ON faqs("order")')
            cur.execute('CREATE INDEX IF NOT EXISTS ix_partners_active ON partners(is_active)')
            cur.execute('CREATE INDEX IF NOT EXISTS ix_news_created_at ON news(created_at)')
            cur.execute('CREATE INDEX IF NOT EXISTS ix_forms_submission ON forms(submission_id)')
            cur.execute('CREATE INDEX IF NOT EXISTS ix_submission_questions_submission ON submission_questions(submission_id)')
            cur.execute('CREATE INDEX IF NOT EXISTS ix_form_questions_form ON form_questions(form_id)')
            cur.execute('CREATE INDEX IF NOT EXISTS ix_form_answers_form_question ON form_answers(form_question_id)')

        conn.commit()
        print("✅ Tables ensured successfully")
    finally:
        conn.close()


def main() -> None:
    load_dotenv()

    host = get_env_value("POSTGRES_HOST", "DB_HOST")
    port = int(get_env_value("POSTGRES_PORT", "DB_PORT"))
    dbname = get_env_value("POSTGRES_DB", "DB_NAME")
    user = get_env_value("POSTGRES_USER", "DB_USER")
    password = get_env_value("POSTGRES_PASSWORD", "DB_PASSWORD")

    # Ensure database exists (requires user with createdb or superuser privileges)
    try:
        ensure_database_exists(host=host, port=port, admin_user=user, admin_password=password, database_name=dbname)
    except Exception as e:
        print(f"ℹ️ Could not verify/create database (continuing): {e}")

    # Ensure all tables exist
    create_tables(host=host, port=port, dbname=dbname, user=user, password=password)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"❌ Error: {exc}")
        sys.exit(1)
    sys.exit(0)


