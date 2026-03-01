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
          className={`animate-gradient absolute inset-0 rounded-full blur-md ${formState.file !== null ? "from-success via-tone-positive to-success-emphasis bg-gradient-to-r blur" : "from-accent-muted via-accent-subtle to-accent-muted bg-gradient-to-r"}`}
        />
        <label htmlFor="file-input-material" className="text-center">
          <div
            className={`dark:hover:text-accent hover:text-text-primary border-border bg-surface-base dark:bg-surface-raised relative flex items-center justify-center rounded-full border shadow-sm transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl lg:h-64 lg:w-64 lg:flex-col lg:p-4 ${formState.file !== null ? "border-success" : ""}`}
          >
            <div className="text-text-secondary p-2">Datei wählen</div>
            <div
              className={`p-2 text-center font-bold ${file ? "text-success-emphasis" : ""}`}
            >
              {file ? file?.name : "Hier könnte dein Material stehen!"}
            </div>
            <input
              id="file-input-material"
              className="border-border hidden h-fit w-full min-w-0 rounded-md border px-4 py-2"
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
