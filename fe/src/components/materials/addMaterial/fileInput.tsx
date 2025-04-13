import { useState } from "react";

type PropType = {
  formState: {
    file: string | null;
  };
  setFormState: any;
};

export default function FileInput({ formState, setFormState }: PropType) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      file: event.target.value ?? null,
    });
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <>
      <div className="relative mx-auto mb-4 flex items-center justify-center md:mb-10">
        <div
          className={`animate-gradient absolute inset-0 rounded-full blur-md ${formState.file !== null ? "blur bg-gradient-to-r from-green-500 via-emerald-500 to-green-700" : "bg-gradient-to-r from-purple-200 via-emerald-100 to-purple-200"}`}
        />
        <label htmlFor="file-input-material" className="text-center">
          <div
            className={`relative flex items-center justify-center dark:hover:text-purple-300 hover:text-stone-900 hover:shadow-xl rounded-full border border-slate-200 bg-white dark:bg-slate-800 shadow-sm hover:scale-105 transition-all duration-200 ease-in-out lg:h-64 lg:w-64 lg:flex-col lg:p-4 ${formState.file !== null ? "border-green-400" : ""}`}
          >
            <div className="p-2 text-slate-600">Datei wählen</div>
            <div
              className={`p-2 text-center font-bold ${file ? "text-emerald-700" : ""}`}
            >
              {file ? file?.name : "Hier könnte dein Material stehen!"}
            </div>
            <input
              id="file-input-material"
              className="hidden h-fit w-full min-w-0 rounded-md border border-slate-200 px-4 py-2"
              type="file"
              name="file"
              onChange={handleFileChange}
              accept="application/pdf"
              required
            />
          </div>
        </label>
      </div>
    </>
  );
}
