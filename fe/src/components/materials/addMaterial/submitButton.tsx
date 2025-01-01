import { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";

type PropType = {
  formState: {
    file: string | null;
    title: string;
    description: string;
  };
};

export default function SubmitButton({ formState }: PropType) {
  const navigation = useNavigation();
  const [completion, setCompletion] = useState(0);

  const checkCompletionProgress = () => {
    const titleSet = formState.title !== "";
    const descriptionSet = formState.description !== "";
    const fileSet = formState.file !== null;
    setCompletion(countTrue(titleSet, descriptionSet, fileSet));
  };

  const countTrue = (...vars: boolean[]) => {
    return vars.filter((v) => v).length;
  };

  const enableSubmitButton = () => {
    if (
      formState.title !== "" &&
      formState.description !== "" &&
      formState.file !== null
    ) {
      return true;
    }
  };

  useEffect(() => {
    checkCompletionProgress();
  }, [formState]);

  return (
    <>
      <button
        className="mt-10 grid grid-cols-3 rounded-lg border border-slate-200 shadow-sm enabled:hover:bg-emerald-600 enabled:hover:shadow-lg disabled:bg-slate-200"
        type="submit"
        disabled={navigation.state === "submitting" || !enableSubmitButton()}
      >
        <div
          className={`relative py-2 ${completion >= 1 ? "rounded-l-lg bg-emerald-500" : ""}`}
        ></div>
        <div className={`py-2 ${completion >= 2 ? "bg-emerald-500" : ""}`}>
          {navigation.state === "submitting" ? "Erstelle..." : "Erstellen"}
        </div>
        <div
          className={`py-2 ${completion >= 3 ? "rounded-r-lg bg-emerald-500" : ""}`}
        ></div>
      </button>
    </>
  );
}
