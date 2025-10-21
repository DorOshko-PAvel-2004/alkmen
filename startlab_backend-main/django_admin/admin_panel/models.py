from django.db import models


class Partner(models.Model):
    """Модель партнера"""
    name = models.TextField(verbose_name='Название компании')
    title = models.TextField(blank=True, null=True, verbose_name='Заголовок')
    logo = models.ImageField(upload_to='partners/', blank=True, null=True, verbose_name='Логотип')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    website = models.URLField(blank=True, null=True, verbose_name='Ссылка на сайт')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        db_table = 'partners'
        verbose_name = 'Партнер'
        verbose_name_plural = 'Партнеры'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class FAQ(models.Model):
    """Модель FAQ"""
    question = models.TextField(verbose_name='Вопрос')
    answer = models.TextField(verbose_name='Ответ')
    image = models.ImageField(upload_to='faqs/', blank=True, null=True, verbose_name='Изображение')
    order = models.IntegerField(verbose_name='Порядок')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        db_table = 'faqs'
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQ'
        ordering = ['order']
        managed = False
    
    def __str__(self):
        return self.question[:100] + "..." if len(self.question) > 100 else self.question


class News(models.Model):
    """Модель новости"""
    title = models.TextField(verbose_name='Заголовок')
    content = models.TextField(verbose_name='Содержание')
    image = models.ImageField(upload_to='news/', blank=True, null=True, verbose_name='Изображение')
    is_active = models.BooleanField(default=True, verbose_name='Активна')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        db_table = 'news'
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        managed = False
    
    def __str__(self):
        return self.title


class Answer(models.Model):
    """Унифицированные ответы (science) -> таблица answers"""
    title = models.TextField(blank=True, null=True, verbose_name='Название проекта')
    relevance = models.TextField(blank=True, null=True, verbose_name='Актуальность')
    goal = models.TextField(blank=True, null=True, verbose_name='Цель')
    tasks = models.TextField(blank=True, null=True, verbose_name='Задачи')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    expectedResults = models.TextField(blank=True, null=True, verbose_name='Ожидаемые результаты')
    marketAssessment = models.TextField(blank=True, null=True, verbose_name='Оценка рынка')
    competitionAnalysis = models.TextField(blank=True, null=True, verbose_name='Анализ конкурентов')
    budgetBYN = models.TextField(blank=True, null=True, verbose_name='Бюджет BYN')
    timeline = models.TextField(blank=True, null=True, verbose_name='Сроки')
    label = models.TextField(blank=True, null=True, verbose_name='Нужны ли сокомандники')
    url = models.TextField(blank=True, null=True, verbose_name='URL вложения')
    additionalInfo = models.TextField(blank=True, null=True, verbose_name='Доп. информация')
    sha256 = models.TextField(verbose_name='SHA256')

    class Meta:
        db_table = 'answers'
        verbose_name = 'Science заявка'
        verbose_name_plural = 'Science заявки'
        managed = False

    def __str__(self):
        return f"{self.title or 'Без названия'}"


class Answer2(models.Model):
    """Стартап заявки -> таблица answer_2"""
    title = models.TextField(blank=True, null=True, verbose_name='Название')
    problemStatementShort = models.TextField(blank=True, null=True, verbose_name='Краткое описание проблемы')
    goal = models.TextField(blank=True, null=True, verbose_name='Цель')
    stageAndNextSteps = models.TextField(blank=True, null=True, verbose_name='Стадия и шаги')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    founderMotivationAndExpertise = models.TextField(blank=True, null=True, verbose_name='Экспертиза основателя')
    expectedResults = models.TextField(blank=True, null=True, verbose_name='Ожидаемые результаты')
    benefitForBelarus = models.TextField(blank=True, null=True, verbose_name='Польза для Беларуси')
    marketAssessment = models.TextField(blank=True, null=True, verbose_name='Оценка рынка')
    monetization = models.TextField(blank=True, null=True, verbose_name='Монетизация')
    competitionAnalysis = models.TextField(blank=True, null=True, verbose_name='Анализ конкурентов')
    budgetBYN = models.TextField(blank=True, null=True, verbose_name='Бюджет BYN')
    needsInvestmentNow = models.TextField(blank=True, null=True, verbose_name='Нужны инвестиции сейчас')
    timeline = models.TextField(blank=True, null=True, verbose_name='Сроки')
    label = models.TextField(blank=True, null=True, verbose_name='Нужны ли сокомандники')
    url = models.TextField(blank=True, null=True, verbose_name='URL вложения')
    additionalInfo = models.TextField(blank=True, null=True, verbose_name='Доп. информация')
    sha256 = models.TextField(verbose_name='SHA256')

    class Meta:
        db_table = 'answer_2'
        verbose_name = 'Startup заявка'
        verbose_name_plural = 'Startup заявки'
        managed = False

    def __str__(self):
        return f"{self.title or 'Без названия'}"


class Team(models.Model):
    """Команда по sha256 (общая таблица для обоих типов) -> table team"""
    lastName = models.TextField(blank=True, null=True, verbose_name='Фамилия')
    firstName = models.TextField(blank=True, null=True, verbose_name='Имя')
    middleName = models.TextField(blank=True, null=True, verbose_name='Отчество')
    faculty = models.TextField(blank=True, null=True, verbose_name='Факультет')
    group = models.TextField(blank=True, null=True, verbose_name='Группа')
    phone = models.TextField(blank=True, null=True, verbose_name='Телефон')
    email = models.TextField(blank=True, null=True, verbose_name='Email')
    keySkills = models.TextField(blank=True, null=True, verbose_name='Ключевые навыки')
    role = models.TextField(blank=True, null=True, verbose_name='Роль')
    sha256 = models.TextField(verbose_name='SHA256')

    class Meta:
        db_table = 'team'
        verbose_name = 'Участник команды'
        verbose_name_plural = 'Команда'
        managed = True

    def __str__(self):
        return f"{self.lastName or ''} {self.firstName or ''}".strip() or f"team:{self.id}"


class Supervisor2(models.Model):
    """Руководитель (science) -> table supervisor_2"""
    fullName = models.TextField(blank=True, null=True, verbose_name='ФИО')
    academicTitle = models.TextField(blank=True, null=True, verbose_name='Ученая степень/звание')
    position = models.TextField(blank=True, null=True, verbose_name='Должность')
    phone = models.TextField(blank=True, null=True, verbose_name='Телефон')
    email = models.TextField(blank=True, null=True, verbose_name='Email')
    sha256 = models.TextField(verbose_name='SHA256')

    class Meta:
        db_table = 'supervisor_2'
        verbose_name = 'Руководитель'
        verbose_name_plural = 'Руководители'
        managed = False

    def __str__(self):
        return self.fullName or f"supervisor:{self.id}"


class Submission(models.Model):
    """Заявка"""
    title = models.TextField(verbose_name='Название')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        db_table = 'submissions'
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        ordering = ['-created_at']
        managed = False

    def __str__(self):
        return self.title


class Form(models.Model):
    """Форма (принадлежит заявке)"""
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, verbose_name='Заявка')
    name = models.TextField(verbose_name='Название формы')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        db_table = 'forms'
        verbose_name = 'Форма'
        verbose_name_plural = 'Формы'
        ordering = ['submission', 'name']
        managed = False

    def __str__(self):
        return f"{self.name}"


class SubmissionQuestion(models.Model):
    """Вопрос заявки"""
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, verbose_name='Заявка')
    question_text = models.TextField(verbose_name='Вопрос')
    question_order = models.IntegerField(verbose_name='Порядок')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        db_table = 'submission_questions'
        verbose_name = 'Вопрос заявки'
        verbose_name_plural = 'Вопросы заявки'
        ordering = ['submission', 'question_order']
        managed = False

    def __str__(self):
        return self.question_text[:80] + '...' if len(self.question_text) > 80 else self.question_text


class FormQuestion(models.Model):
    """Вопрос формы (ссылка на вопрос заявки)"""
    form = models.ForeignKey(Form, on_delete=models.CASCADE, verbose_name='Форма')
    submission_question = models.ForeignKey(SubmissionQuestion, on_delete=models.CASCADE, verbose_name='Вопрос заявки')
    question_text = models.TextField(verbose_name='Вопрос (текст)')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        db_table = 'form_questions'
        verbose_name = 'Вопрос формы'
        verbose_name_plural = 'Вопросы формы'
        ordering = ['form', 'id']
        managed = False

    def __str__(self):
        return self.question_text[:80] + '...' if len(self.question_text) > 80 else self.question_text


class FormAnswer(models.Model):
    """Ответ на вопрос формы"""
    form_question = models.ForeignKey(FormQuestion, on_delete=models.CASCADE, verbose_name='Вопрос формы')
    answer_text = models.TextField(blank=True, null=True, verbose_name='Ответ (текст)')
    sha256_hash = models.TextField(verbose_name='SHA256')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        db_table = 'form_answers'
        verbose_name = 'Ответ на вопрос формы'
        verbose_name_plural = 'Ответы на вопросы формы'
        ordering = ['-created_at']
        managed = False

    def __str__(self):
        return f"Ответ {self.id}"
