import { useState } from "react";
import { FormHeader } from "@/components/FormComponents/FormHeader";
import { FormNavbar } from "@/components/FormComponents/FormNavbar";
import { ProjectComponent } from "@/components/StartupComponents/ProjectComponent";
import { IdeaComponent } from "@/components/StartupComponents/IdeaComponent";
import { ProgressComponent } from "@/components/StartupComponents/ProgressComponent";
import { ResultComponent } from "@/components/StartupComponents/ResultComponent";
import { TeamComponent } from "@/components/StartupComponents/TeamComponent";
import { MainFormComponent } from "@/components/FormComponents/MainFormComponent";
import { AddComponent } from "@/components/FormComponents/AddComponent";
import { Pill } from "@/components/ui/pill";
import { useNavigate } from "@tanstack/react-router";
import { submitStartupForm } from "@/api/submit";

type TeamMember = {
  fullName: string;
  faculty: string;
  group: string;
  phone: string;
  email: string;
  keySkills: string;
  role: string;
};

export const StartupFormPage = () => {
  // PROJECT
  const [title, setTitle] = useState("");
  const [problemStatementShort, setProblemStatementShort] = useState("");
  const [goal, setGoal] = useState("");

  // IDEA
  const [founderMotivationAndExpertise, setFounderMotivationAndExpertise] =
    useState("");
  const [competitionAnalysis, setCompetitionAnalysis] = useState("");
  const [benefitForBelarus, setBenefitForBelarus] = useState("");

  // PROGRESS
  const [stageAndNextSteps, setStageAndNextSteps] = useState("");
  const [needsInvestmentNow, setNeedsInvestmentNow] = useState("");

  // RESULT & MONEY
  const [timeline, setTimeline] = useState("");
  const [monetization, setMonetization] = useState("");

  // TEAM
  const [videoUrl, setVideoUrl] = useState("");
  const [positionsLabel, setPositionsLabel] = useState("");
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

  // ADDITIONAL (НЕобязательно)
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState<boolean>(false);

  // NEW: флаг первой попытки сабмита, чтобы подсветить пустые поля
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const navigate = useNavigate();

  // NEW: Проверка только на пустые поля (всё, кроме блока AddComponent)
  const hasEmptyRequired = () => {
    const requiredStrings = [
      title,
      problemStatementShort,
      goal,
      founderMotivationAndExpertise,
      competitionAnalysis,
      benefitForBelarus,
      stageAndNextSteps,
      needsInvestmentNow,
      timeline,
      monetization,
    ];

    const stringsOk = requiredStrings.every((v) => v.trim().length > 0);

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

    return !(stringsOk && teamOk); // true => есть пустые
  };

  const scrollToFirstError = () => {
    // Элементам с ошибкой ниже мы добавим data-error="true"
    const first = document.querySelector('[data-error="true"]');
    if (first && "scrollIntoView" in first) {
      first.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const onSubmitStartup = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOnce(true);

    if (hasEmptyRequired()) {
      // просто подсветим и проскроллим к первому ошибочному
      scrollToFirstError();
      return;
    }
    const attachments =
      videoUrl.trim().length > 0
        ? [{ label: positionsLabel.trim() || "", url: videoUrl.trim() }]
        : [];

    submitStartupForm(
      {
        title,
        problemStatementShort,
        goal,
        stageAndNextSteps,
        founderMotivationAndExpertise,
        benefitForBelarus,
        monetization,
        competitionAnalysis,
        needsInvestmentNow,
        timeline,
        team,
        additionalInfo,
        attachments,
      },
      { navigate, setSubmitting, setError: setSubmitError, setOk: setSubmitOk },
    );
  };
  const showFormError = submittedOnce && hasEmptyRequired();

  return (
    <div className="px-4 py-16">
      <FormHeader
        color="lime"
        category="Стартапы и продукты"
        sectionNumber="02"
      />

      <form onSubmit={onSubmitStartup}>
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mt-10 md:mt-24 overflow-x-hidden">
          <div className="basis-full lg:basis-2/3 min-w-0 space-y-8">
            {/* ПРОЕКТ */}
            <section id="project" className="scroll-mt-28 md:scroll-mt-32">
              <ProjectComponent
                submitted={submittedOnce}
                titleValue={title}
                onTitleChange={setTitle}
                problemShortValue={problemStatementShort}
                onProblemShortChange={setProblemStatementShort}
                goalValue={goal}
                onGoalChange={setGoal}
              />
            </section>

            {/* ИДЕЯ */}
            <section id="idea" className="scroll-mt-28 md:scroll-mt-32">
              <IdeaComponent
                submitted={submittedOnce}
                motivationValue={founderMotivationAndExpertise}
                onMotivationChange={setFounderMotivationAndExpertise}
                competitionValue={competitionAnalysis}
                onCompetitionChange={setCompetitionAnalysis}
                benefitValue={benefitForBelarus}
                onBenefitChange={setBenefitForBelarus}
              />
            </section>

            {/* ПРОГРЕСС */}
            <section id="progress" className="scroll-mt-28 md:scroll-mt-32">
              <ProgressComponent
                submitted={submittedOnce}
                stageValue={stageAndNextSteps}
                onStageChange={setStageAndNextSteps}
                needsInvestmentValue={needsInvestmentNow}
                onNeedsInvestmentChange={setNeedsInvestmentNow}
              />
            </section>

            {/* РЕЗУЛЬТАТ */}
            <section id="result" className="scroll-mt-28 md:scroll-mt-32">
              <ResultComponent
                submitted={submittedOnce}
                timelineValue={timeline}
                onTimelineChange={setTimeline}
                monetizationValue={monetization}
                onMonetizationChange={setMonetization}
              />
            </section>

            {/* КОМАНДА */}
            <section id="team" className="scroll-mt-28 md:scroll-mt-32">
              <TeamComponent
                submitted={submittedOnce}
                videoUrlValue={videoUrl}
                onVideoUrlChange={setVideoUrl}
                positionsLabelValue={positionsLabel}
                onPositionsLabelChange={setPositionsLabel}
              />
            </section>

            {/* УЧАСТНИКИ */}
            <section className="bg-gray-100 p-6 py-8 rounded-lg border-2">
              <MainFormComponent
                submitted={submittedOnce}
                hasAdvisor={false}
                supervisor={{
                  fullName: "",
                  academicTitle: "",
                  position: "",
                  phone: "",
                  email: "",
                }}
                onSupervisorChange={() => {}}
                team={team}
                onTeamChange={setTeam}
              />
            </section>

            {/* ДОПОЛНИТЕЛЬНО (необязательное) */}
            <section id="extra" className="!mt-24 scroll-mt-28 md:scroll-mt-32">
              <AddComponent
                additionalInfoValue={additionalInfo}
                onAdditionalInfoChange={setAdditionalInfo}
              />
            </section>

            {/* Submit */}
            <div className="flex flex-col gap-2 w-full">
              <button type="submit" className="w-full" disabled={submitting}>
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
            <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
              <FormNavbar variant="startup" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
