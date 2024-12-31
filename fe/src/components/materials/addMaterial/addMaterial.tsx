import { Form, useNavigation } from "react-router-dom";
import Price from "./price";
import { useEffect, useState } from "react";

function AddMaterials() {
  const navigation = useNavigation();
  const [formState, setFormState] = useState({
    file: null as string | null,
    title: "",
    description: "",
    price: "",
  });
  const [completion, setCompletion] = useState(0);

  const checkCompletion = () => {
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
    checkCompletion();
    console.log(completion);
  }, [formState]);

  return (
    <div className="flex min-w-0 justify-center">
      <div className="relative mx-4 my-8 mb-16 min-w-0 md:my-20">
        <div className="animate-gradient absolute inset-0 block min-w-0 bg-gradient-to-r from-purple-200 via-green-200 to-pink-300 blur-lg lg:blur-2xl" />
        <div className="relative min-w-0 rounded-lg border border-slate-200 bg-white p-10 shadow-2xl">
          <Form
            className="flex min-w-0 flex-col gap-4"
            method="post"
            encType="multipart/form-data"
          >
            <div className="mx-auto flex w-full flex-col gap-8 sm:w-96">
              <div className="relative mx-auto md:mb-10">
                <div
                  className={`animate-gradient absolute inset-0 rounded-full blur-md ${formState.file !== null ? "bg-gradient-to-r from-green-500 via-emerald-500 to-green-800 " : "bg-gradient-to-r from-purple-500 via-emerald-500 to-purple-800 "}`}
                />
                <div
                  className={`relative flex h-64 w-64 items-center rounded-full border border-slate-200 bg-white p-4 shadow-sm ${formState.file !== null ? "border-green-400" : ""}`}
                >
                  <input
                    className="h-fit w-full min-w-0 rounded-md border border-slate-200 px-4 py-2"
                    type="file"
                    name="file"
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        file: e.target.value ?? null,
                      })
                    }
                    accept="application/pdf"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-1 grid-cols-[.2fr_1fr] flex-col md:grid md:gap-5">
                <label className="p-2" htmlFor="title">
                  Titel
                </label>
                <input
                  id="title"
                  className="min-w-0 rounded-md border border-slate-200 px-4 py-2 shadow-sm"
                  type="text"
                  name="title"
                  onChange={(e) =>
                    setFormState({ ...formState, title: e.target.value })
                  }
                  required
                />
                <label className="p-2" htmlFor="description">
                  Beschreibung
                </label>
                <textarea
                  id="description"
                  className="min-w-0 rounded-md border border-slate-200 p-2 shadow-sm"
                  name="description"
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  required
                />
                <label className="p-2" htmlFor="price">
                  Preis
                </label>
                <Price />
              </div>
            </div>
            <button
              className="mt-10 grid grid-cols-3 rounded-lg border border-slate-200 shadow-sm enabled:hover:bg-emerald-600 enabled:hover:shadow-lg disabled:bg-slate-200"
              type="submit"
              disabled={
                navigation.state === "submitting" || !enableSubmitButton()
              }
            >
              <div
                className={`relative py-2 ${completion >= 1 ? "rounded-l-lg bg-emerald-500" : ""}`}
              ></div>
              <div
                className={`py-2 ${completion >= 2 ? "bg-emerald-500" : ""}`}
              >
                {navigation.state === "submitting" ? "Erstelle..." : "Erstellen"}
              </div>
              <div
                className={`py-2 ${completion >= 3 ? "rounded-r-lg bg-emerald-500" : ""}`}
              ></div>
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddMaterials;
