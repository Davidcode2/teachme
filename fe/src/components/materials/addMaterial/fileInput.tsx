type PropType = {
  formState: {
    file: string | null;
  };
  setFormState: any;
};

export default function FileInput({ formState, setFormState }: PropType) {
  return (
    <>
      <div className="relative mx-auto mb-4 flex items-center justify-center md:mb-10">
        <div
          className={`animate-gradient absolute inset-0 rounded-full blur-md ${formState.file !== null ? "bg-gradient-to-r from-green-500 via-emerald-500 to-green-800 " : "bg-gradient-to-r from-purple-200 via-emerald-100 to-purple-200 "}`}
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
    </>
  );
}
