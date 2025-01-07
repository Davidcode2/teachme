import { useState } from "react";

export default function Price({initialValue}: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);

  const formatCurrency = (value: string) => {
    if (!value) return "0,00";
    return (Number(value) / 100).toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setValue(rawValue);
  };

  return (
    <div className="flex min-w-0">
      <input
        id="price-field"
        onChange={handleChange}
        className="min-w-0 grow max-w-52 rounded-md border border-slate-200 px-4 py-2 text-5xl shadow-sm"
        name="price"
        type="decimal"
        placeholder="0,00"
        value={formatCurrency(value!)}
      />
      <div className="mx-4 self-end py-4 text-5xl">€</div>
    </div>
  );
}
