import catSticker from "./assets/catSticker.jpg";
import ChevronIcon from "./assets/icons/icons8-chevron-24.png";
import { Link, useRouteError } from "react-router";

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <>
      <div className="flex h-screen flex-col place-items-center justify-center gap-10 p-10">
        <h1 className="text-9xl font-extrabold text-slate-600">Ups</h1>
        <img src={catSticker} alt="" width="200" />
        <h1 className="text-center text-4xl font-bold text-slate-500">
          Ein unerwarteter Fehler ist aufgetreten
        </h1>
        <p className="text-4xl font-bold text-slate-500">
          {error.statusText || error.message}{" "}
        </p>
        <Link
          to="/materials"
          className="flex flex-col text-center font-bold text-slate-500"
        >
          <img className="self-center p-4 md:px-20" src={ChevronIcon} alt="" />
          Zurück zur Startseite
        </Link>
        <a
          className="text-slate-400"
          href="https://www.freepik.com/free-vector/sticker-design-with-little-cat-isolated_18987720.htm#fromView=search&page=1&position=38&uuid=ef7ff577-d622-4bd8-8061-7dc8d84cbf83"
        >
          Image by brgfx on Freepik
        </a>
      </div>
    </>
  );
}
