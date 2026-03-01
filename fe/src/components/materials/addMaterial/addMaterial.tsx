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
          fromColor="accent-muted"
          toColor="accent-weak"
          viaColor="accent-muted"
        >
          <div className="border-border bg-surface-base min-w-0 rounded-lg border shadow-2xl">
            <Form
              className="bg-surface-base dark:bg-surface-raised flex min-w-0 flex-col items-center gap-6 rounded-lg px-8 py-6 pt-10 sm:w-96"
              method="post"
              encType="multipart/form-data"
            >
              <div className="flex w-full flex-col">
                <FileInput formState={formState} setFormState={setFormState} />
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label
                      className="text-text-secondary dark:text-text-primary block text-sm font-medium"
                      htmlFor="title"
                    >
                      Titel
                    </label>
                    <input
                      id="title"
                      className="border-border text-text-primary focus:ring-success dark:text-text-inverse mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-xs"
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
                      className="text-text-secondary dark:text-text-primary block text-sm font-medium"
                      htmlFor="description"
                    >
                      Beschreibung
                    </label>
                    <textarea
                      id="description"
                      className="border-border text-text-primary focus:ring-success dark:text-text-inverse mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-xs"
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
                      className="text-text-secondary dark:text-text-primary mb-1 block text-sm font-medium"
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
