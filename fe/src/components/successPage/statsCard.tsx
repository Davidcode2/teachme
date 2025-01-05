import { useEffect, useState } from "react";

type PropType = {
  name: string;
  amount: number | null;
};

export default function SuccessPage({ name, amount }: PropType) {

   const [count, setCount] = useState(0);

  useEffect(() => {
    const target = amount || 0;
    const increment = 1;

    let current = 0;
    const interval = setInterval(() => {
      if (current >= target) {
        clearInterval(interval);
      } else {
        current += increment;
        setCount(Math.floor(current)); // Update state with the new count
      }
    }, 30); // 20 ms interval to smooth the transition

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [amount]);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 py-4 pl-10 pr-4 shadow-sm">
      <div className="text-xl">{name}</div>
      <div
        className={`flex h-20 w-20 items-center justify-center justify-self-center rounded-full border-8 text-center ${amount ? "border-green-500" : "border-slate-200"}`}
      >
        <div className="text-2xl font-extrabold">{count || 0}</div>
      </div>
    </div>
  );
}
