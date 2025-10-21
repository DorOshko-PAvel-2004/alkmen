import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

export const MarketComponent = ({
  submitted = false,
  marketAssessmentValue,
  onMarketAssessmentChange,
  competitionAnalysisValue,
  onCompetitionAnalysisChange,
}: {
  submitted?: boolean;
  marketAssessmentValue: string;
  onMarketAssessmentChange: (v: string) => void;
  competitionAnalysisValue: string;
  onCompetitionAnalysisChange: (v: string) => void;
}) => {
  const sMarket = getFieldState(submitted, marketAssessmentValue);
  const sComp = getFieldState(submitted, competitionAnalysisValue);

  return (
    <FormItem title="Рынок и конкуренты" withIcon={true}>
      <div className="flex flex-col gap-8">
        <FormInput
          title="Оценка потенциального рынка"
          placeholder="Кто потребитель, объём, динамика"
          type="textarea"
          value={marketAssessmentValue}
          onChange={onMarketAssessmentChange}
          state={sMarket}
          // @ts-ignore
          data-error={sMarket === "error"}
        />
        <FormInput
          title="Конкурентный анализ"
          placeholder="Аналоги, преимущества, импортозамещение"
          type="textarea"
          value={competitionAnalysisValue}
          onChange={onCompetitionAnalysisChange}
          state={sComp}
          // @ts-ignore
          data-error={sComp === "error"}
        />
      </div>
    </FormItem>
  );
};
