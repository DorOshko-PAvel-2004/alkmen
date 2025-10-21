from ..config.database import execute_query

def create_tables():
    """Создает все таблицы в базе данных"""
    print("🗄️ Создание таблиц в базе данных...")
    
    # SQL команды для создания таблиц
    tables_sql = [

        
        # Таблица этапов проекта
        """
        CREATE TABLE IF NOT EXISTS project_stages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            description TEXT,
            "order" INTEGER NOT NULL,
            start_date TIMESTAMP,
            end_date TIMESTAMP,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,
        
        # Таблица FAQ
        """
        CREATE TABLE IF NOT EXISTS faqs (
            id SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            "order" INTEGER NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,
        
        # Таблица контактов
        """
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            title VARCHAR(200) NOT NULL,
            value TEXT NOT NULL,
            icon VARCHAR(10),
            "order" INTEGER NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,
        
        # Таблица партнеров
        """
        CREATE TABLE IF NOT EXISTS partners (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            title VARCHAR(200),
            logo VARCHAR(255),
            package VARCHAR(50) NOT NULL,
            description TEXT,
            website VARCHAR(255),
            "order" INTEGER NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,
        
        # Таблица команд
        """
        CREATE TABLE IF NOT EXISTS teams (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            type VARCHAR(50) NOT NULL,
            participant_status VARCHAR(100),
            status VARCHAR(50) NOT NULL DEFAULT 'active',
            location VARCHAR(100),
            can_print BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,
        
        # Таблица проектов команд
        """
        CREATE TABLE IF NOT EXISTS team_projects (
            id SERIAL PRIMARY KEY,
            team_id INTEGER REFERENCES teams(id),
            project_title VARCHAR(300) NOT NULL,
            project_description TEXT,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            current_stage_id INTEGER REFERENCES project_stages(id),
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """,
        
        # Таблица заявок на партнерство
        """
        CREATE TABLE IF NOT EXISTS partnership_requests (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(200) NOT NULL,
            contact_person VARCHAR(200) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(50),
            package VARCHAR(50) NOT NULL,
            message TEXT,
            status VARCHAR(50) NOT NULL DEFAULT 'new',
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """
        ,
        # Таблица team
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
        )
        """
        ,
        # Таблица supervisor_2
        """
        CREATE TABLE IF NOT EXISTS supervisor_2 (
            id SERIAL PRIMARY KEY,
            "fullName" VARCHAR(255),
            "academicTitle" VARCHAR(255),
            "position" VARCHAR(255),
            "phone" VARCHAR(255),
            "email" VARCHAR(255),
            "sha256" VARCHAR(64)
        )
        """
        ,
        # Таблица answers
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
        )
        """
        ,
        # Таблица answer_2 для стартапов
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
        )
        """
    ]
    
    try:
        # Создаем каждую таблицу
        for i, sql in enumerate(tables_sql, 1):
            print(f"📋 Создание таблицы {i}/{len(tables_sql)}...")
            execute_query(sql, fetch=False)
        
        print("✅ Все таблицы успешно созданы!")
        
        # Создаем индексы для улучшения производительности
        print("🔍 Создание индексов...")
        indexes_sql = [
            "CREATE INDEX IF NOT EXISTS ix_faqs_order ON faqs(\"order\")",
            "CREATE INDEX IF NOT EXISTS ix_project_stages_order ON project_stages(\"order\")",
            "CREATE INDEX IF NOT EXISTS ix_contacts_order ON contacts(\"order\")",
            "CREATE INDEX IF NOT EXISTS ix_partners_order ON partners(\"order\")",
            "CREATE INDEX IF NOT EXISTS ix_teams_status ON teams(status)",
            "CREATE INDEX IF NOT EXISTS ix_team_projects_status ON team_projects(status)"
        ]
        
        for index_sql in indexes_sql:
            execute_query(index_sql, fetch=False)
        
        print("✅ Все индексы успешно созданы!")
        
    except Exception as e:
        print(f"❌ Ошибка при создании таблиц: {e}")
        raise

if __name__ == "__main__":
    create_tables()







