// pages/ScienceFormPage.tsx
import { useState } from "react";
import { FormHeader } from "@/components/FormComponents/FormHeader";
import { MainFormComponent } from "@/components/FormComponents/MainFormComponent";
import { AddComponent } from "@/components/FormComponents/AddComponent";
import { Pill } from "@/components/ui/pill";
import { FormNavbar } from "@/components/FormComponents/FormNavbar";
import { IdeaComponent } from "@/components/ScienceComponents/IdeaComponent";
import { AimComponent } from "@/components/ScienceComponents/AimComponent";
import { ResultComponent } from "@/components/ScienceComponents/ResultComponent";
import { PlanComponent } from "@/components/ScienceComponents/PlanComponent";
import { MarketComponent } from "@/components/ScienceComponents/MarketComponent";
import { useNavigate } from "@tanstack/react-router";
import { submitScienceForm } from "@/api/submit";

type TeamMember = {
  fullName: string;
  faculty: string;
  group: string;
  phone: string;
  email: string;
  keySkills: string;
  role: string;
};

type Supervisor = {
  fullName: string;
  academicTitle: string;
  position: string;
  phone: string;
  email: string;
};

export const ScienceFormPage = () => {
  // ИДЕЯ
  const [title, setTitle] = useState("");
  const [relevance, setRelevance] = useState("");
  const [description, setDescription] = useState("");

  // ЦЕЛИ И ЗАДАЧИ
  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState("");

  // ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ
  const [expectedResults, setExpectedResults] = useState("");

  // РЫНОК
  const [marketAssessment, setMarketAssessment] = useState("");
  const [competitionAnalysis, setCompetitionAnalysis] = useState("");

  // ПЛАН И БЮДЖЕТ
  const [budgetBYN, setBudgetBYN] = useState("");
  const [timeline, setTimeline] = useState("");

  // РУКОВОДИТЕЛЬ
  const [supervisor, setSupervisor] = useState<Supervisor>({
    fullName: "",
    academicTitle: "",
    position: "",
    phone: "",
    email: "",
  });

  // КОМАНДА
  const [team, setTeam] = useState<TeamMember[]>([
    {
      fullName: "",
      faculty: "",
      group: "",
      phone: "",
      email: "",
      keySkills: "",
      role: "",
    },
  ]);

  // ДОПОЛНИТЕЛЬНО (необязательное)
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState<boolean>(false);

  // Подсветка после первой попытки
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const navigate = useNavigate();

  // Проверяем только на пустые (всё, кроме additionalInfo)
  const hasEmptyRequired = () => {
    const requiredStrings = [
      title,
      relevance,
      description,
      goal,
      tasks,
      expectedResults,
      marketAssessment,
      competitionAnalysis,
      budgetBYN,
      timeline,
    ];
    const stringsOk = requiredStrings.every((v) => (v ?? "").trim().length > 0);

    const supervisorOk = [
      supervisor.fullName,
      supervisor.academicTitle,
      supervisor.position,
      supervisor.phone,
      supervisor.email,
    ].every((v) => (v ?? "").trim().length > 0);

    const teamOk = team.every((m) =>
      [
        m.fullName,
        m.faculty,
        m.group,
        m.phone,
        m.email,
        m.keySkills,
        m.role,
      ].every((v) => (v ?? "").trim().length > 0),
    );

    return !(stringsOk && supervisorOk && teamOk);
  };

  const scrollToFirstError = () => {
    const first = document.querySelector('[data-error="true"]');
    if (first && "scrollIntoView" in first) {
      first.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const onSubmitScience = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOnce(true);

    if (hasEmptyRequired()) {
      scrollToFirstError();
      return;
    }

    submitScienceForm(
      {
        title,
        relevance,
        goal,
        tasks,
        description,
        expectedResults,
        marketAssessment,
        competitionAnalysis,
        budgetBYN,
        timeline,
        team,
        supervisor,
        additionalInfo, // НЕобязательное
      },
      { navigate, setSubmitting, setError: setSubmitError, setOk: setSubmitOk },
    );
  };

  const showFormError = submittedOnce && hasEmptyRequired();

  return (
    <div className="px-4 py-16">
      <FormHeader
        color="purple"
        category="Наука и технологии"
        sectionNumber="01"
      />

      <form onSubmit={onSubmitScience}>
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mt-10 md:mt-24 overflow-x-hidden">
          <div className="basis-full lg:basis-2/3 min-w-0 space-y-8">
            {/* Научная идея */}
            <section id="s-idea" className="scroll-mt-28 md:scroll-mt-32">
              <IdeaComponent
                submitted={submittedOnce}
                titleValue={title}
                onTitleChange={setTitle}
                relevanceValue={relevance}
                onRelevanceChange={setRelevance}
                descriptionValue={description}
                onDescriptionChange={setDescription}
              />
            </section>

            {/* Цели и задачи */}
            <section id="s-aim" className="scroll-mt-28 md:scroll-mt-32">
              <AimComponent
                submitted={submittedOnce}
                goalValue={goal}
                onGoalChange={setGoal}
                tasksValue={tasks}
                onTasksChange={setTasks}
              />
            </section>

            {/* Ожидаемые результаты */}
            <section id="s-result" className="scroll-mt-28 md:scroll-mt-32">
              <ResultComponent
                submitted={submittedOnce}
                expectedResultsValue={expectedResults}
                onExpectedResultsChange={setExpectedResults}
              />
            </section>

            {/* Рынок и конкуренты */}
            <section id="s-market" className="scroll-mt-28 md:scroll-mt-32">
              <MarketComponent
                submitted={submittedOnce}
                marketAssessmentValue={marketAssessment}
                onMarketAssessmentChange={setMarketAssessment}
                competitionAnalysisValue={competitionAnalysis}
                onCompetitionAnalysisChange={setCompetitionAnalysis}
              />
            </section>

            {/* План и бюджет */}
            <section id="s-plan" className="scroll-mt-28 md:scroll-mt-32">
              <PlanComponent
                submitted={submittedOnce}
                budgetValue={budgetBYN}
                onBudgetChange={setBudgetBYN}
                timelineValue={timeline}
                onTimelineChange={setTimeline}
              />
            </section>

            {/* Команда и руководитель — обязательные */}
            <section
              id="s-team"
              className="scroll-mt-28 md:scroll-mt-32 bg-gray-100 p-6 py-8 rounded-lg border-2"
            >
              <MainFormComponent
                submitted={submittedOnce}
                hasAdvisor={true}
                supervisor={supervisor}
                onSupervisorChange={setSupervisor}
                team={team}
                onTeamChange={setTeam}
              />
            </section>

            {/* Дополнительно — НЕобязательное */}
            <section
              id="s-extra"
              className="!mt-24 scroll-mt-28 md:scroll-mt-32"
            >
              <AddComponent
                additionalInfoValue={additionalInfo}
                onAdditionalInfoChange={setAdditionalInfo}
              />
            </section>

            {/* Submit */}
            <div className="flex flex-col gap-2 w-full">
              <button
                type="submit"
                className="w-full"
                disabled={submitting}
                aria-disabled={submitting}
              >
                <Pill className="uppercase !rounded-lg w-full duration-300 hover:bg-brand-purple hover:text-brand-lime">
                  <div className="flex items-center gap-1">
                    <div className="uppercase py-1">
                      {submitting ? "отправка..." : "подать заявку"}
                    </div>
                  </div>
                </Pill>
              </button>

              {/* Глобальная ошибка под кнопкой */}
              {showFormError && (
                <div
                  className="text-red-600 text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  Пожалуйста, заполните все обязательные поля — форма не
                  отправлена.
                </div>
              )}

              <div className="text-brand-gray">
                Нажимая «ПОДАТЬ ЗАЯВКУ» вы соглашаетесь с &nbsp;
                <a
                  target="_blank"
                  href="https://iis.bsuir.by/public_iis_files/cookiePolicy.pdf"
                  className="font-bold underline"
                >
                  Политикой конфиденциальности
                </a>
                .
              </div>

              {submitOk && (
                <div className="text-green-600 text-sm">
                  Заявка успешно отправлена.
                </div>
              )}
              {submitError && (
                <div className="text-red-600 text-sm">
                  Ошибка: {submitError}
                </div>
              )}
            </div>
          </div>

          <div className="basis-full lg:basis-1/3 shrink-0 mt-6 lg:mt-0 self-start">
            <FormNavbar variant="science" stickyTopClass="top-28" />
          </div>
        </div>
      </form>
    </div>
  );
};
