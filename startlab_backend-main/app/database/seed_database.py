from database import SessionLocal
from models import (
    FAQ, ProjectStage, Contact, Partner, 
    PartnershipRequest, Team, TeamProject, 
    PackageType, ContactType, TeamType, ProjectStatus, 
    PartnershipStatus
)
import hashlib
import os
from datetime import datetime, timedelta

def hash_password(password: str) -> str:
    """Хеширует пароль используя SHA256 + соль"""
    salt = os.urandom(32).hex()
    hash_obj = hashlib.sha256((password + salt).encode())
    return f"{salt}${hash_obj.hexdigest()}"

def seed_database():
    """Заполняет базу данных начальными данными"""
    db = SessionLocal()
    
    try:
        print("🌱 Заполнение базы данных начальными данными...")
        
        # Пользователи удалены из проекта
        
        # Создаем этапы проекта
        print("📋 Создание этапов проекта...")
        stages = [
            ProjectStage(
                name="Регистрация и подача заявок",
                description="Подача заявок на участие в конкурсе, создание команд",
                order=1,
                start_date=datetime.now(),
                end_date=datetime.now() + timedelta(days=30)
            ),
            ProjectStage(
                name="Отборочный этап",
                description="Первичная оценка проектов экспертной комиссией",
                order=2,
                start_date=datetime.now() + timedelta(days=31),
                end_date=datetime.now() + timedelta(days=60)
            ),
            ProjectStage(
                name="Полуфинал",
                description="Детальная презентация проектов и защита",
                order=3,
                start_date=datetime.now() + timedelta(days=61),
                end_date=datetime.now() + timedelta(days=90)
            ),
            ProjectStage(
                name="Финал",
                description="Финальная презентация лучших проектов перед жюри",
                order=4,
                start_date=datetime.now() + timedelta(days=91),
                end_date=datetime.now() + timedelta(days=120)
            )
        ]
        
        db.add_all(stages)
        db.commit()
        db.refresh(stages[0])
        db.refresh(stages[1])
        db.refresh(stages[2])
        db.refresh(stages[3])
        
        # Создаем FAQ
        print("❓ Создание FAQ...")
        faqs = [
            FAQ(
                question="Как подать заявку на участие в конкурсе?",
                answer="Для участия в конкурсе необходимо зарегистрироваться на сайте, создать команду и заполнить все необходимые формы. Подробная инструкция доступна в разделе 'Правила'.",
                order=1
            ),
            FAQ(
                question="Какие документы нужны для участия?",
                answer="Для участия потребуется паспорт, студенческий билет (для студентов), заявка на участие и описание проекта. Полный список документов указан в правилах конкурса.",
                order=2
            ),
            FAQ(
                question="Можно ли участвовать индивидуально?",
                answer="Да, можно участвовать как индивидуально, так и в составе команды. Однако командное участие дает дополнительные преимущества при оценке проектов.",
                order=3
            ),
            FAQ(
                question="Как стать партнером конкурса?",
                answer="Для партнерства свяжитесь с нами через форму на странице 'Партнерам' или напишите на email. Мы обсудим возможности сотрудничества и подберем подходящий пакет.",
                order=4
            ),
            FAQ(
                question="Какие призы можно выиграть?",
                answer="Призовой фонд включает денежные призы, гранты на развитие проекта, менторскую поддержку и возможность представить проект инвесторам.",
                order=5
            ),
            FAQ(
                question="Когда объявляются результаты?",
                answer="Результаты каждого этапа объявляются в течение недели после его завершения. Финальные результаты публикуются на сайте и в социальных сетях.",
                order=6
            )
        ]
        
        db.add_all(faqs)
        db.commit()
        
        # Создаем контакты
        print("📞 Создание контактов...")
        contacts = [
            Contact(
                type=ContactType.address,
                title="Адрес",
                value="г. Минск, ул. Платонова, 39\nБГУИР, корпус 5",
                icon="📍",
                order=1
            ),
            Contact(
                type=ContactType.phone,
                title="Телефон",
                value="+375 (17) 293-88-88\n+375 (29) 123-45-67",
                icon="📞",
                order=2
            ),
            Contact(
                type=ContactType.email,
                title="Email",
                value="startlab@bsuir.by\ninfo@startlab.by",
                icon="✉️",
                order=3
            ),
            Contact(
                type=ContactType.social,
                title="Время работы",
                value="Пн-Пт: 9:00 - 18:00\nСб: 10:00 - 15:00",
                icon="🕒",
                order=4
            ),
            Contact(
                type=ContactType.social,
                title="Telegram",
                value="@startlab_bsuir",
                icon="📱",
                order=5
            ),
            Contact(
                type=ContactType.social,
                title="VKontakte",
                value="vk.com/startlab_bsuir",
                icon="💙",
                order=6
            )
        ]
        
        db.add_all(contacts)
        db.commit()
        
        # Создаем партнеров
        print("🤝 Создание партнеров...")
        partners = [
            Partner(
                name="БГУИР",
                logo="/images/partners/bsuir.png",
                package=PackageType.gold,
                description="Белорусский государственный университет информатики и радиоэлектроники - основной организатор конкурса СТАРТЛАБ.",
                website="https://www.bsuir.by",
                order=1
            ),
            Partner(
                name="Huawei",
                logo="/images/partners/huawei.png",
                package=PackageType.gold,
                description="Ведущая технологическая компания, предоставляющая инфраструктуру и решения для цифровой трансформации.",
                website="https://www.huawei.com",
                order=2
            ),
            Partner(
                name="YADRO",
                logo="/images/partners/yadro.png",
                package=PackageType.silver,
                description="Компания-разработчик высокопроизводительных серверов и систем хранения данных.",
                website="https://www.yadro.com",
                order=3
            ),
            Partner(
                name="T-Bank",
                logo="/images/partners/tbank.png",
                package=PackageType.silver,
                description="Банк, специализирующийся на поддержке стартапов и инновационных проектов.",
                website="https://www.tbank.by",
                order=4
            ),
            Partner(
                name="TechArena",
                logo="/images/partners/techarena.png",
                package=PackageType.bronze,
                description="Технологическая платформа для развития IT-сообщества и поддержки инноваций.",
                website="https://www.techarena.by",
                order=5
            )
        ]
        
        db.add_all(partners)
        db.commit()
        
        # Создаем команды
        print("👥 Создание команд...")
        teams = [
            Team(
                name="Тестовая команда 'Инноваторы'",
                type=TeamType.university,
                participant_status="Студенты 3-4 курса",
                status="active",
                location="Минск",
                can_print=True
            ),
            Team(
                name="Команда 'ЭкоТех'",
                type=TeamType.university,
                participant_status="Студенты 2-3 курса",
                status="active",
                location="Гродно",
                can_print=True
            ),
            Team(
                name="Команда 'МедИнновации'",
                type=TeamType.university,
                participant_status="Студенты 4-5 курса",
                status="active",
                location="Витебск",
                can_print=True
            ),
            Team(
                name="Команда 'УмныйГород'",
                type=TeamType.school,
                participant_status="Учащиеся 10-11 классов",
                status="active",
                location="Могилев",
                can_print=False
            )
        ]
        
        db.add_all(teams)
        db.commit()
        db.refresh(teams[0])
        db.refresh(teams[1])
        db.refresh(teams[2])
        db.refresh(teams[3])
        
        # Создаем проекты команд
        print("🚀 Создание проектов команд...")
        projects = [
            TeamProject(
                team_id=teams[0].id,
                project_title="Умная система мониторинга экологии",
                project_description="Инновационная система для мониторинга качества воздуха и воды с использованием IoT-датчиков и машинного обучения.",
                status=ProjectStatus.approved,
                current_stage_id=stages[1].id,

            ),
            TeamProject(
                team_id=teams[1].id,
                project_title="Экологическая платформа для мониторинга загрязнений",
                project_description="Инновационный проект, направленный на решение актуальных проблем современности.",
                status=ProjectStatus.pending,
                current_stage_id=stages[0].id,

            ),
            TeamProject(
                team_id=teams[2].id,
                project_title="Телемедицинская система для удаленной диагностики",
                project_description="Инновационный проект, направленный на решение актуальных проблем современности.",
                status=ProjectStatus.active,
                current_stage_id=stages[2].id,

            ),
            TeamProject(
                team_id=teams[3].id,
                project_title="Умная система управления городским транспортом",
                project_description="Инновационный проект, направленный на решение актуальных проблем современности.",
                status=ProjectStatus.approved,
                current_stage_id=stages[1].id,

            )
        ]
        
        db.add_all(projects)
        db.commit()
        
        # Создаем заявки на партнерство
        print("📝 Создание заявок на партнерство...")
        partnership_requests = [
            PartnershipRequest(
                company_name="ИнноваТех",
                contact_person="Иван Петров",
                email="ivan@innovatech.by",
                phone="+375 (29) 555-12-34",
                package=PackageType.silver,
                message="Заинтересованы в партнерстве с конкурсом СТАРТЛАБ. Готовы предоставить техническую поддержку и менторство.",
                status=PartnershipStatus.new
            ),
            PartnershipRequest(
                company_name="СтартАпЛаб",
                contact_person="Мария Сидорова",
                email="maria@startuplab.by",
                phone="+375 (29) 777-88-99",
                package=PackageType.bronze,
                message="Хотим стать партнером конкурса и поддержать молодых предпринимателей.",
                status=PartnershipStatus.reviewed
            ),
            PartnershipRequest(
                company_name="ТехИнвест",
                contact_person="Алексей Козлов",
                email="alex@techinvest.by",
                phone="+375 (29) 333-44-55",
                package=PackageType.custom,
                message="Интересует индивидуальное партнерство с возможностью инвестирования в лучшие проекты.",
                status=PartnershipStatus.contacted
            )
        ]
        
        db.add_all(partnership_requests)
        db.commit()
        
        print("✅ База данных успешно заполнена!")
        print("\n📊 Статистика:")
        print(f"👥 Пользователей: {db.query(User).count()}")
        print(f"❓ FAQ: {db.query(FAQ).count()}")
        print(f"📋 Этапов проекта: {db.query(ProjectStage).count()}")
        print(f"📞 Контактов: {db.query(Contact).count()}")
        print(f"🤝 Партнеров: {db.query(Partner).count()}")
        print(f"👥 Команд: {db.query(Team).count()}")
        print(f"🚀 Проектов: {db.query(TeamProject).count()}")
        print(f"📝 Заявок на партнерство: {db.query(PartnershipRequest).count()}")
        
        print("\n🔑 Тестовые пользователи:")
        print("👨‍💼 admin / admin123 (Администратор)")
        print("👨‍🎓 student / student123 (Студент)")
        print("👨‍🏫 teacher / teacher123 (Преподаватель)")
        
    except Exception as e:
        print(f"❌ Ошибка при заполнении базы данных: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
