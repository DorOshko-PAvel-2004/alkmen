import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { Pill } from "@/components/ui/pill.tsx";
import Plus from "@/assets/plus.svg?url";
import { getFieldState } from "@/utils/formState";

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

type MainFormComponentProps = {
  hasAdvisor?: boolean;
  supervisor: Supervisor;
  onSupervisorChange: (s: Supervisor) => void;
  team: TeamMember[];
  onTeamChange: (t: TeamMember[]) => void;
};

export const MainFormComponent = ({
  submitted = false,
  hasAdvisor = false,
  supervisor,
  onSupervisorChange,
  team,
  onTeamChange,
}: MainFormComponentProps & { submitted?: boolean }) => {
  const addParticipant = () => {
    const next = [
      ...team,
      {
        fullName: "",
        faculty: "",
        group: "",
        phone: "",
        email: "",
        keySkills: "",
        role: "",
      },
    ];
    onTeamChange(next);
  };

  // NEW: удаление участника по индексу
  const removeParticipant = (idx: number) => {
    const next = team.filter((_, i) => i !== idx);
    onTeamChange(next);
  };

  const setSup = (patch: Partial<Supervisor>) =>
    onSupervisorChange({ ...supervisor, ...patch });
  const setMember = (idx: number, patch: Partial<TeamMember>) => {
    const copy = [...team];
    copy[idx] = { ...copy[idx], ...patch } as TeamMember;
    onTeamChange(copy);
  };

  return (
    <FormItem title="заявка членов команды" withIcon={true}>
      <div className="flex flex-col gap-8">
        {hasAdvisor && (
          <div className="flex flex-col gap-6 rounded-2xl bg-gray-200 border border-gray-200 p-4">
            <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              научный руководитель
            </div>
            <FormInput
              title="ФИО руководителя"
              value={supervisor.fullName}
              onChange={(v) => setSup({ fullName: v })}
              state={getFieldState(submitted, supervisor.fullName)}
            />
            <FormInput
              title="Ученое звание / степень"
              value={supervisor.academicTitle}
              onChange={(v) => setSup({ academicTitle: v })}
              state={getFieldState(submitted, supervisor.academicTitle)}
            />
            <FormInput
              title="Должность"
              value={supervisor.position}
              onChange={(v) => setSup({ position: v })}
              state={getFieldState(submitted, supervisor.position)}
            />
            <FormInput
              title="Мобильный телефон"
              value={supervisor.phone}
              onChange={(v) => setSup({ phone: v })}
              state={getFieldState(submitted, supervisor.phone)}
            />
            <FormInput
              title="Электронная почта"
              value={supervisor.email}
              onChange={(v) => setSup({ email: v })}
              state={getFieldState(submitted, supervisor.email)}
            />
          </div>
        )}

        {team.map((member, idx) => {
          const n = idx + 1;
          return (
            <div
              key={idx}
              className="flex flex-col gap-6 rounded-2xl border border-gray-200 p-4 bg-gray-200 relative"
            >
              {/* NEW: заголовок с крестиком удаления со 2-го участника */}
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  участник {n}
                </div>
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(idx)}
                    aria-label={`Удалить участника ${n}`}
                    title={`Удалить участника ${n}`}
                    className="rounded-lg p-1 text-gray-500 hover:text-brand-purple hover:bg-white/60 transition-colors"
                  >
                    {/* Небольшой встроенный крестик-иконка (SVG), чтобы не тянуть зависимость */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>

              <FormInput
                title={`ФИО ${n}`}
                value={member.fullName}
                onChange={(v) => setMember(idx, { fullName: v })}
                state={getFieldState(submitted, member.fullName)}
              />
              <FormInput
                title={`Факультет ${n}`}
                value={member.faculty}
                onChange={(v) => setMember(idx, { faculty: v })}
                state={getFieldState(submitted, member.faculty)}
              />
              <FormInput
                title={`Группа ${n}`}
                value={member.group}
                onChange={(v) => setMember(idx, { group: v })}
                state={getFieldState(submitted, member.group)}
              />
              <FormInput
                title={`Мобильный телефон / Ник в ТГ ${n}`}
                value={member.phone}
                onChange={(v) => setMember(idx, { phone: v })}
                state={getFieldState(submitted, member.phone)}
              />
              <FormInput
                title={`Электронная почта ${n}`}
                value={member.email}
                onChange={(v) => setMember(idx, { email: v })}
                state={getFieldState(submitted, member.email)}
              />
              <FormInput
                title={`Ключевые компетенции ${n}`}
                value={member.keySkills}
                onChange={(v) => setMember(idx, { keySkills: v })}
                state={getFieldState(submitted, member.keySkills)}
              />
              <FormInput
                title={`Занимаемая позиция в проекте ${n}`}
                value={member.role}
                onChange={(v) => setMember(idx, { role: v })}
                state={getFieldState(submitted, member.role)}
              />
            </div>
          );
        })}

        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={addParticipant}
            className="w-full sm:w-[40%]"
          >
            <Pill className="uppercase !rounded-lg w-full hover:bg-brand-lite-green !duration-300">
              <div className="flex items-center justify-center gap-2 py-1.5">
                <img src={Plus} alt="Иконка плюса" className="w-5" />
                <div className="uppercase">участник</div>
              </div>
            </Pill>
          </button>
        </div>
      </div>
    </FormItem>
  );
};
