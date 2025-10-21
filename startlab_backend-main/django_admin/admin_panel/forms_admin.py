from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django.db.models import Count, Min, Max
from django.http import HttpResponse
from django.utils.html import format_html
from .models import Form, Question, FormQuestion, FormAnswer


@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    """Админка для форм"""
    list_display = ('name', 'created_at')
    search_fields = ('name',)
    readonly_fields = ('created_at',)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    """Админка для вопросов"""
    list_display = ('question_text', 'created_at')
    search_fields = ('question_text',)
    readonly_fields = ('created_at',)


@admin.register(FormQuestion)
class FormQuestionAdmin(admin.ModelAdmin):
    """Админка для вопросов форм"""
    list_display = ('form', 'question', 'question_order', 'created_at')
    list_filter = ('form', 'created_at')
    search_fields = ('form__name', 'question__question_text')
    ordering = ('form', 'question_order')
    readonly_fields = ('created_at',)


@admin.register(FormAnswer)
class FormAnswerAdmin(admin.ModelAdmin):
    """Админка для ответов на формы"""
    list_display = ('id', 'sha256_hash_short', 'form_question', 'answer_preview', 'has_docx', 'created_at')
    list_filter = ('created_at', 'form_question__form')
    search_fields = ('sha256_hash', 'answer_txt', 'form_question__question__question_text')
    readonly_fields = ('sha256_hash', 'form_question', 'answer_txt', 'answer_docx', 'created_at')
    ordering = ('-created_at',)
    
    def sha256_hash_short(self, obj):
        return f"{obj.sha256_hash[:16]}..."
    sha256_hash_short.short_description = 'SHA256 хеш'
    
    def answer_preview(self, obj):
        if obj.answer_txt:
            return obj.answer_txt[:100] + "..." if len(obj.answer_txt) > 100 else obj.answer_txt
        return "—"
    answer_preview.short_description = 'Ответ'
    
    def has_docx(self, obj):
        if obj.answer_docx:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: gray;">—</span>')
    has_docx.short_description = 'DOCX'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('by-submission/', self.admin_site.admin_view(self.by_submission_view), name='formanswer_by_submission'),
            path('submission/<str:sha256_hash>/', self.admin_site.admin_view(self.submission_detail_view), name='formanswer_submission_detail'),
        ]
        return custom_urls + urls
    
    def by_submission_view(self, request):
        """Страница со списком уникальных отправок (SHA256 хешей)"""
        submissions = FormAnswer.objects.values('sha256_hash').annotate(
            answers_count=Count('id'),
            first_created=Min('created_at'),
            last_created=Max('created_at')
        ).order_by('-first_created')
        
        context = {
            'title': 'Отправки форм',
            'submissions': submissions,
            'opts': self.model._meta,
            'has_view_permission': True,
        }
        return render(request, 'admin/formanswer_by_submission.html', context)
    
    def submission_detail_view(self, request, sha256_hash):
        """Детальная страница отправки по SHA256 хешу"""
        answers = FormAnswer.objects.filter(sha256_hash=sha256_hash).select_related(
            'form_question__form', 'form_question__question'
        ).order_by('form_question__question_order')
        
        if not answers.exists():
            return HttpResponse("Отправка не найдена", status=404)
        
        # Группируем ответы по форме
        forms_data = {}
        for answer in answers:
            form = answer.form_question.form
            if form.id not in forms_data:
                forms_data[form.id] = {
                    'form': form,
                    'answers': []
                }
            forms_data[form.id]['answers'].append(answer)
        
        context = {
            'title': f'Детали отправки {sha256_hash[:16]}...',
            'sha256_hash': sha256_hash,
            'forms_data': forms_data.values(),
            'total_answers': answers.count(),
            'opts': self.model._meta,
            'has_view_permission': True,
        }
        return render(request, 'admin/formanswer_submission_detail.html', context)
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['show_by_submission_link'] = True
        return super().changelist_view(request, extra_context)
