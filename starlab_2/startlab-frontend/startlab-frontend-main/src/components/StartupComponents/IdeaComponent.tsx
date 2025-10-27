import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

export const IdeaComponent = ({
  submitted = false,
  motivationValue,
  onMotivationChange,
  competitionValue,
  onCompetitionChange,
  benefitValue,
  onBenefitChange,
}: {
  submitted?: boolean;
  motivationValue: string;
  onMotivationChange: (v: string) => void;
  competitionValue: string;
  onCompetitionChange: (v: string) => void;
  benefitValue: string;
  onBenefitChange: (v: string) => void;
}) => {
  return (
    <FormItem title="Идея" withIcon={true}>
      <div className="flex flex-col gap-8">
        <FormInput
          title="Почему вы решили работать над этой идеей? Есть ли у вас экспертные знания в этой области?"
          type="textarea"
          placeholder="Мы сами геймеры и инженеры, хорошо понимаем потребности игрового сообщества. У нас есть опыт в стриминге и создании продуктов для больших аудиторий."
          value={motivationValue}
          onChange={onMotivationChange}
          state={getFieldState(submitted, motivationValue)}
          // @ts-ignore
          data-error={getFieldState(submitted, motivationValue) === "error"}
        />
        <FormInput
          title="Есть ли у вас конкуренты? Что знаете вы, чего не знают или не умеют ваши конкуренты?"
          type="textarea"
          placeholder="YouTube и Ustream фокусируются на видео в целом, а не на играх. Мы предлагаем интерактивное сообщество с донатами и чатом, что создаёт уникальный пользовательский опыт."
          value={competitionValue}
          onChange={onCompetitionChange}
          state={getFieldState(submitted, competitionValue)}
          // @ts-ignore
          data-error={getFieldState(submitted, competitionValue) === "error"}
        />
        <FormInput
          type="textarea"
          title="Какую пользу ваш проект может принести гражданам Беларуси?"
          placeholder="Белорусские создатели смогут транслировать игры, находить глобальную аудиторию и зарабатывать. Зрители получат доступ к мировым стримам и новым возможностям общения."
          value={benefitValue}
          onChange={onBenefitChange}
          state={getFieldState(submitted, benefitValue)}
          // @ts-ignore
          data-error={getFieldState(submitted, benefitValue) === "error"}
        />
      </div>
    </FormItem>
  );
};
