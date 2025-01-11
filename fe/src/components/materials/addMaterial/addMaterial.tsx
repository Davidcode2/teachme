import { Form } from "react-router";
import Price from "./price";
import FileInput from "./fileInput";
import { useState } from "react";
import SubmitButton from "./submitButton";
import BorderColorBlur from "../../styling/borderColorBlur";

function AddMaterials() {
  const [formState, setFormState] = useState({
    file: null as string | null,
    title: "",
    description: "",
    price: "",
  });

  return (
    <div className="flex min-w-0 justify-center">
      <div className="mx-4 my-8 mb-16 min-w-0 md:my-20">
        <BorderColorBlur
          animate={true}
          blurSize="lg"
          blurSizeLg="2xl"
          fromColor="purple-200"
          toColor="pink-300"
          viaColor="purple-200"
        >
          <div className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-2xl">
            <Form
              className="flex min-w-0 flex-col items-center gap-6 rounded-lg bg-white px-8 py-6 pt-10 sm:w-96"
              method="post"
              encType="multipart/form-data"
            >
              <div className="flex w-full flex-col">
                <FileInput formState={formState} setFormState={setFormState} />
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="title"
                    >
                      Titel
                    </label>
                    <input
                      id="title"
                      className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 shadow-sm focus:ring-emerald-500"
                      type="text"
                      name="title"
                      onChange={(e) =>
                        setFormState({ ...formState, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="description"
                    >
                      Beschreibung
                    </label>
                    <textarea
                      id="description"
                      className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 shadow-sm focus:ring-emerald-500"
                      name="description"
                      rows={4}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="price"
                    >
                      Preis
                    </label>
                    <Price />
                  </div>
                </div>
                <SubmitButton formState={formState} />
              </div>
            </Form>
          </div>
        </BorderColorBlur>
      </div>
    </div>
  );
}

export default AddMaterials;
