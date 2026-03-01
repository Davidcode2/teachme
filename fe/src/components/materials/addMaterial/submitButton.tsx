import { useEffect, useState } from "react";
import { useNavigation } from "react-router";

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
        className="border-border enabled:hover:bg-success-emphasis disabled:bg-surface-overlay dark:text-text-muted mt-10 grid grid-cols-3 rounded-lg border shadow-sm enabled:hover:shadow-lg"
        type="submit"
        disabled={navigation.state === "submitting" || !enableSubmitButton()}
      >
        <div
          className={`h-full ${completion >= 1 ? "bg-success rounded-l-lg" : ""}`}
        ></div>
        <div className={`py-2 ${completion >= 2 ? "bg-success" : ""}`}>
          {navigation.state === "submitting" ? "Erstelle..." : "Erstellen"}
        </div>
        <div
          className={`h-full ${completion >= 3 ? "bg-success rounded-r-lg" : ""}`}
        ></div>
      </button>
    </>
  );
}
