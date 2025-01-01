import { Form } from "react-router-dom";
import Price from "./price";
import FileInput from "./fileInput";
import {  useState } from "react";
import SubmitButton from "./submitButton";

function AddMaterials() {
  const [formState, setFormState] = useState({
    file: null as string | null,
    title: "",
    description: "",
    price: "",
  });

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
              <FileInput formState={formState} setFormState={setFormState} />
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
            <SubmitButton formState={formState} />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddMaterials;
