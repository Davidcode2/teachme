import { useState } from "react";

export default function Price() {
  const [value, setValue] = useState("");

  const formatCurrency = (value: string) => {
    if (!value)  return "0,00";
    return ((Number(value) / 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setValue(rawValue);
  };

  return (
    <div className="flex min-w-0 w-[38%]">
      <input id="price-field" onChange={handleChange} className="grow min-w-0 rounded-md border border-slate-200 shadow-sm py-2 px-4 text-5xl" name="price" type="decimal" placeholder="0,00" value={formatCurrency(value)} />
      <div className="text-5xl self-end py-4 mx-4">€</div>
    </div>
  )
}
