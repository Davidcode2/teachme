import { ChevronLeft } from "lucide-react";
import catSticker from "./assets/catSticker.jpg";
import { Link, useRouteError } from "react-router";

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <>
      <div className="flex h-screen flex-col place-items-center justify-center gap-10 p-10">
        <h1 className="text-text-secondary text-9xl font-extrabold">Ups</h1>
        <img src={catSticker} alt="" width="200" />
        <h1 className="text-text-secondary text-center text-4xl font-bold">
          Ein unerwarteter Fehler ist aufgetreten
        </h1>
        <p className="text-text-secondary text-4xl font-bold">
          {error.statusText || error.message}{" "}
        </p>
        <Link
          to="/materials"
          className="text-text-secondary flex flex-col text-center font-bold"
        >
          <ChevronLeft className="self-center p-4 md:px-20" />
          Zurück zur Startseite
        </Link>
        <a
          className="text-text-muted"
          href="https://www.freepik.com/free-vector/sticker-design-with-little-cat-isolated_18987720.htm#fromView=search&page=1&position=38&uuid=ef7ff577-d622-4bd8-8061-7dc8d84cbf83"
        >
          Image by brgfx on Freepik
        </a>
      </div>
    </>
  );
}
