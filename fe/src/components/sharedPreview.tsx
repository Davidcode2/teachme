import { Link, useLoaderData } from "react-router-dom";
import ActionButtons from "./action-buttons/action-buttons";
import CardService from "../services/cardService";

export default function SharedPreview() {
  const cardService = new CardService();
  const data: any = useLoaderData();
  const images = cardService.getImages(data.preview);
  const imageElements = images.map((img: string, index: number) => (
    <img src={img} alt="" key={index} />
  ));

  return (
    <div className="fixed top-0 z-50 h-screen w-screen backdrop-blur-sm">
      <Link
        to="/materials"
        className="absolute right-0 m-10 text-5xl hover:cursor-pointer"
      >
        x
      </Link>
      <div className="flex h-full items-center justify-center">
        {!data.material && <div>lädt...</div>}
        {data.material && (
          <div className="mx-6 flex flex-col gap-5 rounded-lg border bg-white p-2 shadow-lg sm:flex-row md:mx-10 md:p-10">
            <div className="h-[50vh] overflow-scroll md:h-[75vh]">
              {imageElements}
            </div>
            <div className="flex flex-col gap-5">
              <div className="text-2xl xl:text-4xl">{data.material.title}</div>
              <hr />
              <div>{data.material.description}</div>
              <div className="flex gap-x-10">
                <p className="text-3xl text-emerald-500">
                  {Number(data.material.price / 100).toFixed(2)} €
                </p>
                <ActionButtons
                  id={data.material.id}
                  title={data.material.title}
                  authorId={data.material.author_id}
                  isMine={data.material.file_path}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
