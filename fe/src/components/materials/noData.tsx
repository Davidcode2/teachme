import { useEffect, useState } from "react";
import meow_cat from "../../assets/white_cat_happy_transparent.webp";
export default function NoData({
  message,
  showImage = true,
}: {
  message?: string;
  showImage?: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);

  return (
    <>
      {show && (
        <div className="flex h-[85vh] flex-col place-items-center justify-center">
          {showImage && (
            <img
              src={meow_cat}
              className="max-w-[20%] rounded-xl lg:max-w-[12%]"
            />
          )}
          <div className="mt-4">{message ?? "Zeit zu shoppen!"}</div>
        </div>
      )}
    </>
  );
}
