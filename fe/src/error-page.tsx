import catSticker from "./assets/catSticker.jpg";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex justify-center place-items-center h-screen flex-col gap-10">
      <h1 className="text-9xl text-slate-600 font-extrabold">404</h1>
      <img src={catSticker} alt="" width="200"/>
      <p className="text-2xl text-slate-800">{error.statusText || error.message} </p>
    </div>
  );

}
