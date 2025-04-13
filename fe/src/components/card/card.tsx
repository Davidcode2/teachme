import ActionButtons from "./action-buttons/action-buttons.tsx";
import Author from "./author/author.tsx";
import { useEffect, useState, type JSX } from "react";
import Preview from "../preview.tsx";
import GradientGenerator from "../../services/gradientGenerator.ts";
import CardService from "../../services/cardService.ts";
import BorderColorBlur from "../styling/borderColorBlur.tsx";
import Material from "../../DTOs/material.ts";

function Card({
  material: materialWithThumbnail,
}: {
  material: Material;
}): JSX.Element {
  const [showPreview, setShowPreview] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewImage, setPreviewImage] = useState([""]);
  const cardService = new CardService();
  const gradient = new GradientGenerator().randomGradient();
  const image = cardService.getImages([materialWithThumbnail.thumbnail])[0];

  const togglePreview = async () => {
    setShowPreview(true);
    const json = await cardService.getPreview(
      materialWithThumbnail.id.toString(),
    );
    const images = cardService.getImages(json.preview);
    setPreviewImage(images);
    setPreview(json);
  };

  const imageElement = image ? (
    <img
      src={image}
      onClick={togglePreview}
      className="thumbnail cursor-pointer object-cover object-top transition-transform duration-300 hover:scale-105 sm:h-full md:w-[400px] lg:w-[600px]"
      alt="Thumbnail"
    />
  ) : (
    <div
      className={`thumbnail h-[400px] rounded-l-lg md:w-[400px] lg:w-[600px]`}
      style={{ backgroundImage: gradient }}
    ></div>
  );

  if (!eventListenerRegistered && showPreview === true) {
    document.body.addEventListener("click", (e: any) => {
      if (e.target.closest(".bg-white")) return;
      if (e.target.closest(".thumbnail")) return;
      setShowPreview(false);
    });
    setEventListenerRegistered(true);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const rootElement = document.getElementById(
        materialWithThumbnail.id.toString(),
      );
      rootElement?.classList.add("opacity-100");
    }, 50);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {showPreview && (
        <Preview
          material={preview}
          images={previewImage}
          setShowPreview={setShowPreview}
        />
      )}
      <div
        className="m-4 rounded-lg border border-slate-200 opacity-0 shadow-lg transition-opacity duration-700 md:mx-10 md:mb-10"
        id={materialWithThumbnail.id.toString()}
      >
        <BorderColorBlur>
          <div className="grid h-[250px] grid-cols-[40%_auto] grid-rows-[1fr_auto] overflow-hidden rounded-lg bg-white text-sm sm:h-[450px] sm:grid-cols-2 md:grid-cols-[auto_3fr] dark:bg-slate-800">
            <div className="overflow-hidden border-r border-slate-200 sm:row-span-2">
              {imageElement}
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-r-lg border-slate-100 p-4 md:border-t-0 md:p-10">
              <div className="flex flex-col overflow-auto">
                <div className="text-lg md:text-2xl">
                  {materialWithThumbnail.title}
                </div>
                <div className="line-clamp-5 sm:line-clamp-none md:text-base">
                  {materialWithThumbnail.description}
                </div>
              </div>
              <p className="text-emerald-500 md:text-3xl">
                {Number(materialWithThumbnail.price / 100).toFixed(2)} €
              </p>
            </div>
            <div className="col-span-2 mt-auto flex border-t border-slate-200 p-2 px-4 sm:col-start-2 sm:border-none md:p-10">
              <div className="self-center">
                <ActionButtons
                  id={materialWithThumbnail.id.toString()}
                  title={materialWithThumbnail.title}
                  authorId={materialWithThumbnail.author_id}
                  isMine={materialWithThumbnail.file_path}
                ></ActionButtons>
              </div>
              <div className="ml-auto self-end">
                <Author
                  authorId={materialWithThumbnail.author_id}
                  published={materialWithThumbnail.date_published}
                ></Author>
              </div>
            </div>
          </div>
        </BorderColorBlur>
      </div>
    </>
  );
}

export default Card;
