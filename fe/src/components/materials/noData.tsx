import { useEffect, useState } from 'react';
import meow_cat from '../../assets/white_cat_happy.webp';
export default function NoData({ message, showImage }: { message: string, showImage: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);

  return (
    <>
      {show &&
        <div className="flex flex-col justify-center place-items-center h-[85vh]">
      { showImage ?? <img src={meow_cat} className="lg:max-w-[50%] max-w-[80%] rounded-xl" /> }
          <div className="relative bottom-40">{ message ?? "Zeit zu shoppen!" }</div>
        </div>
      }
    </>
  )
}
