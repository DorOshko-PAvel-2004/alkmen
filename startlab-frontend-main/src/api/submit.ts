import type { NavigateFn } from "@tanstack/react-router";

const ENDPOINT = import.meta.env.VITE_API_BASE_URL + "/api/app/intake-unified";

type SetState<T> = (v: T) => void;

async function postJson(body: unknown): Promise<{ appNum?: string }> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let details = "";
    try {
      details = await res.text();
    } catch {}
    throw new Error(details || `HTTP ${res.status}`);
  }

  // Пытаемся достать номер заявки из ответа (json или текст)
  let appNum: string | undefined;
  try {
    const data = await res.clone().json();
    appNum =
      String(
        data?.number ??
          data?.id ??
          data?.applicationId ??
          data?.applicationNumber ??
          "",
      ) || undefined;
  } catch {
    try {
      const txt = await res.text();
      const m = txt.match(/#?\s*(\d{1,})/);
      if (m) appNum = m[1];
    } catch {}
  }
  return { appNum };
}

/* ====================== SCIENCE ====================== */

export type ScienceTeamMember = {
  fullName: string;
  faculty: string;
  group: string;
  phone: string;
  email: string;
  keySkills: string;
  role: string;
};

export type ScienceSupervisor = {
  fullName: string;
  academicTitle: string;
  position: string;
  phone: string;
  email: string;
};
export type ScienceAttachment = { label: string; url: string };

export type ScienceFormState = {
  title: string;
  relevance: string;
  goal: string;
  tasks: string;
  description: string;
  expectedResults: string;
  marketAssessment: string;
  competitionAnalysis: string;
  budgetBYN: string;
  timeline: string;
  team: ScienceTeamMember[];
  supervisor: ScienceSupervisor;
  additionalInfo: string;
  attachments?: ScienceAttachment[]; // опционально
};

export async function submitScienceForm(
  form: ScienceFormState,
  opts: {
    navigate: NavigateFn;
    setSubmitting: SetState<boolean>;
    setError: SetState<string | null>;
    setOk: SetState<boolean>;
  },
) {
  const { navigate, setSubmitting, setError, setOk } = opts;
  setSubmitting(true);
  setError(null);
  setOk(false);

  const payload = {
    type: "science" as const,
    data: {
      type: "science" as const,
      title: form.title,
      relevance: form.relevance,
      goal: form.goal,
      tasks: form.tasks,
      description: form.description,
      expectedResults: form.expectedResults,
      marketAssessment: form.marketAssessment,
      competitionAnalysis: form.competitionAnalysis,
      budgetBYN: form.budgetBYN,
      timeline: form.timeline,
      team: form.team,
      supervisor: form.supervisor,
      attachments: form.attachments ?? [],
      additionalInfo: form.additionalInfo,
    },
  };

  try {
    const { appNum } = await postJson(payload);
    setOk(true);
    navigate({
      to: "/thank-you/science",
      search: { n: appNum },
    });
  } catch (e: any) {
    setError(e?.message || "Не удалось отправить форму");
  } finally {
    setSubmitting(false);
  }
}

/* ====================== STARTUP ====================== */

export type StartupAttachment = { label: string; url: string };

export type StartupTeamMember = {
  fullName: string;
  faculty: string;
  group: string;
  phone: string;
  email: string;
  keySkills: string;
  role: string;
};

export type StartupFormState = {
  title: string;
  problemStatementShort: string;
  goal: string;
  stageAndNextSteps: string;
  founderMotivationAndExpertise: string;
  benefitForBelarus: string;
  monetization: string;
  competitionAnalysis: string;
  needsInvestmentNow: string;
  timeline: string;
  team: StartupTeamMember[];
  additionalInfo: string;
  attachments?: StartupAttachment[];
};

export async function submitStartupForm(
  form: StartupFormState,
  opts: {
    navigate: NavigateFn;
    setSubmitting: SetState<boolean>;
    setError: SetState<string | null>;
    setOk: SetState<boolean>;
  },
) {
  const { navigate, setSubmitting, setError, setOk } = opts;
  setSubmitting(true);
  setError(null);
  setOk(false);

  const payload = {
    type: "startup" as const,
    data: {
      type: "startup" as const,
      title: form.title,
      problemStatementShort: form.problemStatementShort,
      goal: form.goal,
      stageAndNextSteps: form.stageAndNextSteps,
      founderMotivationAndExpertise: form.founderMotivationAndExpertise,
      benefitForBelarus: form.benefitForBelarus,
      monetization: form.monetization,
      competitionAnalysis: form.competitionAnalysis,
      needsInvestmentNow: form.needsInvestmentNow,
      timeline: form.timeline,
      team: form.team,
      attachments: form.attachments ?? [],
      additionalInfo: form.additionalInfo,
    },
  };

  try {
    const { appNum } = await postJson(payload);
    setOk(true);
    navigate({
      to: "/thank-you/startup",
      search: { n: appNum },
    });
  } catch (e: any) {
    setError(e?.message || "Не удалось отправить форму");
  } finally {
    setSubmitting(false);
  }
}
