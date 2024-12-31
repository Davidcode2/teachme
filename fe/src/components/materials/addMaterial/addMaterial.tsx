import { Form } from "react-router-dom";
import Price from "./price";

function AddMaterials() {
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
                <div className="animate-gradient absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-emerald-500 to-purple-800 blur-md" />
                <div className="relative flex h-64 w-64 items-center rounded-full border border-slate-200 bg-white p-4 shadow-sm">
                  <input
                    className="h-fit w-full min-w-0 rounded-md border border-slate-200 px-4 py-2"
                    type="file"
                    name="file"
                    accept="application/pdf"
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
                />
                <label className="p-2" htmlFor="description">
                  Beschreibung
                </label>
                <textarea
                  id="description"
                  className="min-w-0 rounded-md border border-slate-200 p-2 shadow-sm"
                  name="description"
                />
                <label className="p-2" htmlFor="price">
                  Preis
                </label>
                <Price />
              </div>
            </div>
            <button
              className="mt-10 rounded-lg border border-slate-200 bg-emerald-500 px-4 py-2 shadow-sm hover:bg-emerald-600"
              type="submit"
            >
              Erstellen
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddMaterials;
