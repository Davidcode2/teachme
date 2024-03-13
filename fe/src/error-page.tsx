import catSticker from "./assets/catSticker.jpg";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex justify-center place-items-center h-screen flex-col gap-10">
      <h1 className="text-9xl text-slate-600 font-extrabold">Ups</h1>
      <img src={catSticker} alt="" width="200"/>
      <h1 className="text-4xl text-slate-500 font-bold">Ein unerwarteter Fehler ist aufgetreten</h1>
      <p className="text-4xl text-slate-500 font-bold">{error.statusText || error.message} </p>
    <a className="text-slate-400" href="https://www.freepik.com/free-vector/sticker-design-with-little-cat-isolated_18987720.htm#fromView=search&page=1&position=38&uuid=ef7ff577-d622-4bd8-8061-7dc8d84cbf83">Image by brgfx on Freepik</a>
    </div>
  );

}
