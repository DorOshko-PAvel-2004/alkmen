#!/usr/bin/env python3
"""
API endpoints для работы с заявками/формами/вопросами/ответами
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import hashlib
import json
from datetime import datetime

from ..config.database import execute_query, execute_single_query

router = APIRouter(prefix="/app", tags=["application"])


@router.get("/submissions")
async def list_submissions() -> List[Dict[str, Any]]:
    try:
        return execute_query("SELECT id, title, created_at FROM submissions ORDER BY created_at DESC")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения заявок: {e}")


@router.get("/submissions/{submission_id}/forms")
async def list_forms_for_submission(submission_id: int) -> List[Dict[str, Any]]:
    try:
        # Проверим существование заявки
        sub = execute_single_query("SELECT id FROM submissions WHERE id = %s", (submission_id,))
        if not sub:
            raise HTTPException(status_code=404, detail="Заявка не найдена")
        return execute_query(
            "SELECT id, name, created_at FROM forms WHERE submission_id = %s ORDER BY name",
            (submission_id,)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения форм: {e}")


@router.get("/forms/{form_id}/questions")
async def list_form_questions(form_id: int) -> List[Dict[str, Any]]:
    try:
        # Проверим существование формы
        frm = execute_single_query("SELECT id FROM forms WHERE id = %s", (form_id,))
        if not frm:
            raise HTTPException(status_code=404, detail="Форма не найдена")

        query = """
        SELECT 
            fq.id AS form_question_id,
            fq.question_text,
            sq.question_order
        FROM form_questions fq
        JOIN submission_questions sq ON sq.id = fq.submission_question_id
        WHERE fq.form_id = %s
        ORDER BY sq.question_order
        """
        return execute_query(query, (form_id,))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения вопросов формы: {e}")


@router.post("/science")
async def submit_science_application(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    payload: {
      type: "science",
      answers: [{ form_question_id: int, answer_text: str }],
      participants: [{ last_name, first_name, middle_name?, faculty?, student_group?, phone?, email?, key_competencies?, role_in_implementation? }],
      supervisor: { last_name, first_name, middle_name?, academic_rank?, position?, phone?, email? }
    }
    """
    try:
        app_type = payload.get("type")
        if app_type != "science":
            raise HTTPException(status_code=400, detail="type должен быть 'science'")

        # Найдем форму для науки
        frm = execute_single_query("SELECT id FROM forms WHERE name ILIKE '%наука%' LIMIT 1")
        if not frm:
            raise HTTPException(status_code=404, detail="Форма для науки не найдена")
        form_id = frm["id"]

        # 1) Ответы на вопросы
        answers = payload.get("answers") or []
        group_sha256 = ""
        if answers:
            canonical = json.dumps({
                "form_id": form_id,
                "answers": answers,
                "timestamp": datetime.utcnow().isoformat()
            }, ensure_ascii=False, sort_keys=True)
            group_sha256 = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

            for item in answers:
                form_question_id = item.get("form_question_id")
                answer_text = item.get("answer_text")
                if not form_question_id:
                    raise HTTPException(status_code=400, detail="form_question_id обязателен")
                check = execute_single_query(
                    "SELECT id FROM form_questions WHERE id = %s AND form_id = %s",
                    (form_question_id, form_id)
                )
                if not check:
                    raise HTTPException(status_code=400, detail=f"Вопрос формы {form_question_id} не найден")
                execute_single_query(
                    "INSERT INTO form_answers (form_question_id, answer_text, sha256_hash) VALUES (%s, %s, %s)",
                    (form_question_id, answer_text, group_sha256)
                )

        # 2) Участники
        participants = payload.get("participants") or []
        if participants:
            for p in participants:
                for field in ("last_name", "first_name"):
                    if not p.get(field):
                        raise HTTPException(status_code=400, detail=f"Поле {field} обязательно для участника")
                execute_single_query(
                    """
                    INSERT INTO participants (
                        form_id, last_name, first_name, middle_name, faculty, student_group, phone, email,
                        key_competencies, role_in_implementation, sha256_hash
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        form_id,
                        p.get("last_name"), p.get("first_name"), p.get("middle_name"),
                        p.get("faculty"), p.get("student_group"), p.get("phone"), p.get("email"),
                        p.get("key_competencies"), p.get("role_in_implementation"), group_sha256
                    )
                )

        # 3) Руководитель
        supervisor = payload.get("supervisor")
        if supervisor and supervisor.get("last_name") and supervisor.get("first_name"):
            execute_single_query(
                """
                INSERT INTO supervisors (
                    form_id, last_name, first_name, middle_name, academic_rank, position, phone, email, sha256_hash
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                    form_id,
                    supervisor.get("last_name"), supervisor.get("first_name"), supervisor.get("middle_name"),
                    supervisor.get("academic_rank"), supervisor.get("position"),
                    supervisor.get("phone"), supervisor.get("email"), group_sha256
                )
            )

        return {"message": "Заявка на науку сохранена", "sha256_hash": group_sha256}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения заявки на науку: {e}")


@router.post("/startup")
async def submit_startup_application(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    payload: {
      type: "startup",
      answers: [{ form_question_id: int, answer_text: str }],
      participants: [{ last_name, first_name, middle_name?, faculty?, student_group?, phone?, email?, key_competencies?, role_in_implementation? }]
    }
    """
    try:
        app_type = payload.get("type")
        if app_type != "startup":
            raise HTTPException(status_code=400, detail="type должен быть 'startup'")

        # Найдем форму для стартапа
        frm = execute_single_query("SELECT id FROM forms WHERE name ILIKE '%стартап%' LIMIT 1")
        if not frm:
            raise HTTPException(status_code=404, detail="Форма для стартапа не найдена")
        form_id = frm["id"]

        # 1) Ответы на вопросы
        answers = payload.get("answers") or []
        group_sha256 = ""
        if answers:
            canonical = json.dumps({
                "form_id": form_id,
                "answers": answers,
                "timestamp": datetime.utcnow().isoformat()
            }, ensure_ascii=False, sort_keys=True)
            group_sha256 = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

            for item in answers:
                form_question_id = item.get("form_question_id")
                answer_text = item.get("answer_text")
                if not form_question_id:
                    raise HTTPException(status_code=400, detail="form_question_id обязателен")
                check = execute_single_query(
                    "SELECT id FROM form_questions WHERE id = %s AND form_id = %s",
                    (form_question_id, form_id)
                )
                if not check:
                    raise HTTPException(status_code=400, detail=f"Вопрос формы {form_question_id} не найден")
                execute_single_query(
                    "INSERT INTO form_answers (form_question_id, answer_text, sha256_hash) VALUES (%s, %s, %s)",
                    (form_question_id, answer_text, group_sha256)
                )

        # 2) Участники
        participants = payload.get("participants") or []
        if participants:
            for p in participants:
                for field in ("last_name", "first_name"):
                    if not p.get(field):
                        raise HTTPException(status_code=400, detail=f"Поле {field} обязательно для участника")
                execute_single_query(
                    """
                    INSERT INTO participants (
                        form_id, last_name, first_name, middle_name, faculty, student_group, phone, email,
                        key_competencies, role_in_implementation, sha256_hash
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        form_id,
                        p.get("last_name"), p.get("first_name"), p.get("middle_name"),
                        p.get("faculty"), p.get("student_group"), p.get("phone"), p.get("email"),
                        p.get("key_competencies"), p.get("role_in_implementation"), group_sha256
                    )
                )

        return {"message": "Заявка на стартап сохранена", "sha256_hash": group_sha256}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения заявки на стартап: {e}")


@router.get("/answers-columns")
async def answers_columns_info() -> Dict[str, Any]:
    """Диагностика: показывает БД, хост и список колонок таблицы answers."""
    try:
        db_name_row = execute_single_query("SELECT current_database() AS db") or {"db": None}
        version_row = execute_single_query("SELECT version() AS v") or {"v": None}
        cols = execute_query(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'answers'
            ORDER BY ordinal_position
            """,
            fetch=True
        )
        return {
            "database": db_name_row.get("db"),
            "version": version_row.get("v"),
            "answers_columns": [c["column_name"] for c in cols] if cols else []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Диагностика не удалась: {e}")


@router.post("/intake")
async def intake_application(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Принимает JSON вида:
    {
      "type": "science",
      "title": "", "relevance": "", "goal": "", "tasks": "",
      "description": "", "expectedResults": "", "marketAssessment": "",
      "competitionAnalysis": "", "budgetBYN": "", "timeline": "",
      "team": [{ "fullName": "", "faculty": "", "group": "", "phone": "", "email": "", "keySkills": "", "role": "" }],
      "supervisor": { "fullName": "", "academicTitle": "", "position": "", "phone": "", "email": "" },
      "attachments": [{ "label": "", "url": "" }],  # label = "Нужны ли сокомандники"
      "additionalInfo": ""
    }
    Сохраняет:
    - в answers: основные поля + attachments[0].label/url (label = "Нужны ли сокомандники") + additionalInfo, общий sha256
    - в team: каждого участника (fullName -> last/first/middle), общий sha256
    - в supervisor_2: данные руководителя, общий sha256
    """
    try:
        app_type = payload.get("type")
        if not app_type:
            raise HTTPException(status_code=400, detail="Поле type обязательно")

        # Групповой sha256 для связи записей
        canonical = json.dumps({
            "type": app_type,
            "title": payload.get("title"),
            "relevance": payload.get("relevance"),
            "goal": payload.get("goal"),
            "tasks": payload.get("tasks"),
            "description": payload.get("description"),
            "expectedResults": payload.get("expectedResults"),
            "marketAssessment": payload.get("marketAssessment"),
            "competitionAnalysis": payload.get("competitionAnalysis"),
            "budgetBYN": payload.get("budgetBYN"),
            "timeline": payload.get("timeline"),
            "team": payload.get("team") or [],
            "supervisor": payload.get("supervisor") or {},
            "attachments": payload.get("attachments") or [],
            "additionalInfo": payload.get("additionalInfo"),
            "timestamp": datetime.utcnow().isoformat()
        }, ensure_ascii=False, sort_keys=True)
        group_sha256 = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

        # 1) answers (attachments[0] в label/url)
        attachments = payload.get("attachments") or []
        first_attachment = attachments[0] if attachments else {}
        label = (first_attachment or {}).get("label")
        url = (first_attachment or {}).get("url")

        execute_query(
            """
            INSERT INTO answers (
                "title","relevance","goal","tasks","description","expectedResults",
                "marketAssessment","competitionAnalysis","budgetBYN","timeline",
                "label","url","additionalInfo","sha256"
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                payload.get("title"), payload.get("relevance"), payload.get("goal"), payload.get("tasks"),
                payload.get("description"), payload.get("expectedResults"), payload.get("marketAssessment"),
                payload.get("competitionAnalysis"), payload.get("budgetBYN"), payload.get("timeline"),
                label, url, payload.get("additionalInfo"), group_sha256
            ),
            fetch=False
        )

        # 2) team
        team = payload.get("team") or []
        print(f"🔍 DEBUG: Обрабатываем {len(team)} участников команды")
        for i, member in enumerate(team):
            full_name = (member.get("fullName") or "").strip()
            last_name, first_name, middle_name = None, None, None
            
            print(f"🔍 DEBUG: Участник {i+1}: fullName='{full_name}'")
            
            if full_name:
                parts = [p for p in full_name.split() if p]
                print(f"🔍 DEBUG: Части ФИО: {parts} (количество: {len(parts)})")
                
                if len(parts) >= 3:
                    # Фамилия Имя Отчество
                    last_name = parts[0]
                    first_name = parts[1]
                    middle_name = " ".join(parts[2:])
                    print(f"🔍 DEBUG: 3+ слов: lastName='{last_name}', firstName='{first_name}', middleName='{middle_name}'")
                elif len(parts) == 2:
                    # Фамилия Имя
                    last_name = parts[0]
                    first_name = parts[1]
                    print(f"🔍 DEBUG: 2 слова: lastName='{last_name}', firstName='{first_name}'")
                elif len(parts) == 1:
                    # Только одно слово - считаем его именем
                    first_name = parts[0]
                    print(f"🔍 DEBUG: 1 слово: firstName='{first_name}'")
            
            # Сохраняем участника даже если ФИО неполное
            try:
                execute_query(
                    """
                    INSERT INTO team (
                        "lastName","firstName","middleName","faculty","group","phone","email","keySkills","role","sha256"
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        last_name, first_name, middle_name,
                        member.get("faculty"), member.get("group"), member.get("phone"), member.get("email"),
                        member.get("keySkills"), member.get("role"), group_sha256
                    ),
                    fetch=False
                )
                print(f"✅ DEBUG: Участник {i+1} успешно сохранен в БД")
            except Exception as e:
                print(f"❌ DEBUG: Ошибка сохранения участника {i+1}: {e}")

        # 3) supervisor -> supervisor_2
        supervisor = payload.get("supervisor") or {}
        if supervisor:
            execute_query(
                """
                INSERT INTO supervisor_2 (
                    "fullName","academicTitle","position","phone","email","sha256"
                ) VALUES (%s,%s,%s,%s,%s,%s)
                """,
                (
                    supervisor.get("fullName"), supervisor.get("academicTitle"), supervisor.get("position"),
                    supervisor.get("phone"), supervisor.get("email"), group_sha256
                ),
                fetch=False
            )

        return {"message": "Заявка сохранена", "sha256": group_sha256}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения заявки: {e}")


@router.post("/intake-startup")
async def intake_startup_application(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Принимает JSON для стартапа и сохраняет в answer_2, team. attachments[0] -> label/url (label = "Нужны ли сокомандники"), additionalInfo тоже сохраняется.
    """
    try:
        app_type = payload.get("type")
        if app_type != "startup":
            raise HTTPException(status_code=400, detail="type должен быть 'startup'")

        canonical = json.dumps({
            k: payload.get(k) for k in [
                "type","title","problemStatementShort","goal","stageAndNextSteps","description",
                "founderMotivationAndExpertise","expectedResults","benefitForBelarus","marketAssessment",
                "monetization","competitionAnalysis","budgetBYN","needsInvestmentNow","timeline",
                "team","attachments","additionalInfo"
            ]
        }, ensure_ascii=False, sort_keys=True)
        group_sha256 = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

        attachments = payload.get("attachments") or []
        first_attachment = attachments[0] if attachments else {}
        label = (first_attachment or {}).get("label")
        url = (first_attachment or {}).get("url")

        # answer_2 insert
        execute_query(
            """
            INSERT INTO answer_2 (
                "title","problemStatementShort","goal","stageAndNextSteps","description",
                "founderMotivationAndExpertise","expectedResults","benefitForBelarus","marketAssessment",
                "monetization","competitionAnalysis","budgetBYN","needsInvestmentNow","timeline",
                "label","url","additionalInfo","sha256"
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                payload.get("title"), payload.get("problemStatementShort"), payload.get("goal"), payload.get("stageAndNextSteps"),
                payload.get("description"), payload.get("founderMotivationAndExpertise"), payload.get("expectedResults"), payload.get("benefitForBelarus"),
                payload.get("marketAssessment"), payload.get("monetization"), payload.get("competitionAnalysis"), payload.get("budgetBYN"),
                payload.get("needsInvestmentNow"), payload.get("timeline"), label, url, payload.get("additionalInfo"), group_sha256
            ),
            fetch=False
        )

        # team insert (reuse logic)
        team = payload.get("team") or []
        print(f"🔍 DEBUG Startup: Обрабатываем {len(team)} участников команды")
        for i, member in enumerate(team):
            full_name = (member.get("fullName") or "").strip()
            last_name, first_name, middle_name = None, None, None
            
            print(f"🔍 DEBUG Startup: Участник {i+1}: fullName='{full_name}'")
            
            if full_name:
                parts = [p for p in full_name.split() if p]
                print(f"🔍 DEBUG Startup: Части ФИО: {parts} (количество: {len(parts)})")
                
                if len(parts) >= 3:
                    # Фамилия Имя Отчество
                    last_name = parts[0]
                    first_name = parts[1]
                    middle_name = " ".join(parts[2:])
                    print(f"🔍 DEBUG Startup: 3+ слов: lastName='{last_name}', firstName='{first_name}', middleName='{middle_name}'")
                elif len(parts) == 2:
                    # Фамилия Имя
                    last_name = parts[0]
                    first_name = parts[1]
                    print(f"🔍 DEBUG Startup: 2 слова: lastName='{last_name}', firstName='{first_name}'")
                elif len(parts) == 1:
                    # Только одно слово - считаем его именем
                    first_name = parts[0]
                    print(f"🔍 DEBUG Startup: 1 слово: firstName='{first_name}'")
            
            # Сохраняем участника даже если ФИО неполное
            try:
                execute_query(
                    """
                    INSERT INTO team (
                        "lastName","firstName","middleName","faculty","group","phone","email","keySkills","role","sha256"
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        last_name, first_name, middle_name,
                        member.get("faculty"), member.get("group"), member.get("phone"), member.get("email"),
                        member.get("keySkills"), member.get("role"), group_sha256
                    ),
                    fetch=False
                )
                print(f"✅ DEBUG Startup: Участник {i+1} успешно сохранен в БД")
            except Exception as e:
                print(f"❌ DEBUG Startup: Ошибка сохранения участника {i+1}: {e}")

        return {"message": "Стартап-заявка сохранена", "sha256": group_sha256}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения стартап-заявки: {e}")

@router.post("/intake-unified")
async def intake_unified(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Унифицированный эндпоинт, выполняющий функции двух эндпоинтов:
    {
      "type": "science" | "startup",
      "data": { ... поля такие же, как в /intake или /intake-startup ... }
    }

    Если type == "science" — выполняется логика /intake.
    Иначе — выполняется логика /intake-startup.
    """
    try:
        app_type = (payload or {}).get("type")
        data = (payload or {}).get("data") or {}
        if not app_type:
            raise HTTPException(status_code=400, detail="Поле type обязательно")

        # Приведем к ожидаемому формату: все ключи на верхнем уровне
        normalized = {**data, "type": app_type}

        if str(app_type).lower() == "science":
            # ----- ЛОГИКА /intake -----
            canonical = json.dumps({
                "type": normalized.get("type"),
                "title": normalized.get("title"),
                "relevance": normalized.get("relevance"),
                "goal": normalized.get("goal"),
                "tasks": normalized.get("tasks"),
                "description": normalized.get("description"),
                "expectedResults": normalized.get("expectedResults"),
                "marketAssessment": normalized.get("marketAssessment"),
                "competitionAnalysis": normalized.get("competitionAnalysis"),
                "budgetBYN": normalized.get("budgetBYN"),
                "timeline": normalized.get("timeline"),
                "team": normalized.get("team") or [],
                "supervisor": normalized.get("supervisor") or {},
                "attachments": normalized.get("attachments") or [],
                "additionalInfo": normalized.get("additionalInfo"),
                "timestamp": datetime.utcnow().isoformat()
            }, ensure_ascii=False, sort_keys=True)

            group_sha256 = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

            attachments = normalized.get("attachments") or []
            first_attachment = attachments[0] if attachments else {}
            label = first_attachment.get("label")
            url = first_attachment.get("url")

            # Сохраняем заявку
            execute_query(
                """
                INSERT INTO answers (
                    "title","relevance","goal","tasks","description","expectedResults",
                    "marketAssessment","competitionAnalysis","budgetBYN","timeline",
                    "label","url","additionalInfo","sha256"
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                    normalized.get("title"), normalized.get("relevance"), normalized.get("goal"), normalized.get("tasks"),
                    normalized.get("description"), normalized.get("expectedResults"), normalized.get("marketAssessment"),
                    normalized.get("competitionAnalysis"), normalized.get("budgetBYN"), normalized.get("timeline"),
                    label, url, normalized.get("additionalInfo"), group_sha256
                ),
                fetch=False
            )

            # Вставка участников команды
            team = normalized.get("team") or []
            print(f"🔍 DEBUG Unified: Обрабатываем {len(team)} участников команды")
            for i, member in enumerate(team):
                try:
                    full_name = (member.get("fullName") or "").strip()
                    last_name, first_name, middle_name = None, None, None
                    
                    print(f"🔍 DEBUG Unified: Участник {i+1}: fullName='{full_name}'")
                    
                    if full_name:
                        parts = [p for p in full_name.split() if p]
                        print(f"🔍 DEBUG Unified: Части ФИО: {parts} (количество: {len(parts)})")
                        
                        if len(parts) >= 3:
                            # Фамилия Имя Отчество
                            last_name = parts[0]
                            first_name = parts[1]
                            middle_name = " ".join(parts[2:])
                            print(f"🔍 DEBUG Unified: 3+ слов: lastName='{last_name}', firstName='{first_name}', middleName='{middle_name}'")
                        elif len(parts) == 2:
                            # Фамилия Имя
                            last_name = parts[0]
                            first_name = parts[1]
                            print(f"🔍 DEBUG Unified: 2 слова: lastName='{last_name}', firstName='{first_name}'")
                        elif len(parts) == 1:
                            # Только одно слово - считаем его именем
                            first_name = parts[0]
                            print(f"🔍 DEBUG Unified: 1 слово: firstName='{first_name}'")

                    execute_query(
                        """
                        INSERT INTO team (
                            "lastName","firstName","middleName","faculty","group","phone","email","keySkills","role","sha256"
                        ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                        """,
                        (
                            last_name, first_name, middle_name,
                            member.get("faculty"), member.get("group"), member.get("phone"),
                            member.get("email"), member.get("keySkills"), member.get("role"),
                            group_sha256
                        ),
                        fetch=False
                    )
                    print(f"✅ DEBUG Unified: Участник {i+1} успешно сохранен в БД")
                except Exception as e:
                    print(f"❌ DEBUG Unified: Ошибка сохранения участника {i+1}: {e}")

            # Вставка руководителя
            supervisor = normalized.get("supervisor") or {}
            if supervisor:
                execute_query(
                    """
                    INSERT INTO supervisor_2 (
                        "fullName","academicTitle","position","phone","email","sha256"
                    ) VALUES (%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        supervisor.get("fullName"), supervisor.get("academicTitle"), supervisor.get("position"),
                        supervisor.get("phone"), supervisor.get("email"), group_sha256
                    ),
                    fetch=False
                )

            return {"message": "Заявка сохранена", "sha256": group_sha256}

        else:
            # ----- ЛОГИКА /intake-startup -----
            data_fields = payload.get("data", {})

            # Формируем canonical только с нужными полями (используем только те поля, которые есть в JSON)
            canonical = json.dumps({
                "type": data_fields.get("type"),
                "title": data_fields.get("title"),
                "problemStatementShort": data_fields.get("problemStatementShort"),
                "goal": data_fields.get("goal"),
                "stageAndNextSteps": data_fields.get("stageAndNextSteps"),
                "founderMotivationAndExpertise": data_fields.get("founderMotivationAndExpertise"),
                "benefitForBelarus": data_fields.get("benefitForBelarus"),
                "monetization": data_fields.get("monetization"),
                "competitionAnalysis": data_fields.get("competitionAnalysis"),
                "needsInvestmentNow": data_fields.get("needsInvestmentNow"),
                "timeline": data_fields.get("timeline"),
                "team": data_fields.get("team") or [],
                "attachments": data_fields.get("attachments") or [],
                "additionalInfo": data_fields.get("additionalInfo")
            }, ensure_ascii=False, sort_keys=True)

            group_sha256 = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
            print(f"DEBUG: Generated SHA256: {group_sha256}")

            # Вставляем основную заявку (используем только те поля, которые есть в JSON)
            attachments = data_fields.get("attachments") or []
            first_attachment = attachments[0] if attachments else {}
            label = first_attachment.get("label")
            url = first_attachment.get("url")

            execute_query(
                """
                INSERT INTO answer_2 (
                    "title","problemStatementShort","goal","stageAndNextSteps","description",
                    "founderMotivationAndExpertise","expectedResults","benefitForBelarus","marketAssessment",
                    "monetization","competitionAnalysis","budgetBYN","needsInvestmentNow","timeline",
                    "label","url","additionalInfo","sha256"
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                    data_fields.get("title"),
                    data_fields.get("problemStatementShort"),
                    data_fields.get("goal"),
                    data_fields.get("stageAndNextSteps"),
                    None,  # description - нет в JSON
                    data_fields.get("founderMotivationAndExpertise"),
                    None,  # expectedResults - нет в JSON
                    data_fields.get("benefitForBelarus"),
                    None,  # marketAssessment - нет в JSON
                    data_fields.get("monetization"),
                    data_fields.get("competitionAnalysis"),
                    None,  # budgetBYN - нет в JSON
                    data_fields.get("needsInvestmentNow"),
                    data_fields.get("timeline"),
                    label,
                    url,
                    data_fields.get("additionalInfo"),
                    group_sha256
                ),
                fetch=False
            )

            # Вставка участников команды
            team = data_fields.get("team") or []
            print(f"DEBUG: Found {len(team)} team members to insert")
            for i, member in enumerate(team):
                print(f"DEBUG: Processing team member {i+1}: {member}")
                full_name = (member.get("fullName") or "").strip()
                last_name, first_name, middle_name = None, None, None
                if full_name:
                    parts = [p for p in full_name.split() if p]
                    if len(parts) >= 2:
                        last_name = parts[0]
                        first_name = parts[1]
                        middle_name = " ".join(parts[2:]) if len(parts) > 2 else None
                    else:
                        first_name = parts[0]

                execute_query(
                    """
                    INSERT INTO team (
                        "lastName","firstName","middleName","faculty","group","phone","email","keySkills","role","sha256"
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        last_name, first_name, middle_name,
                        member.get("faculty"),
                        member.get("group"),
                        member.get("phone"),
                        member.get("email"),
                        member.get("keySkills"),
                        member.get("role"),
                        group_sha256
                    ),
                    fetch=False
                )

            return {"message": "Стартап-заявка сохранена", "sha256": group_sha256}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения заявки (unified): {e}")
