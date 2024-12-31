import { useEffect, useState } from "react";

export default function useDebouncedValue(value: number, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler); // Cleanup on value or delay change
  }, [value, delay]);

  return debouncedValue;
}
