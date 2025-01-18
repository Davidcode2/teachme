import ActionButtons from "./action-buttons/action-buttons.tsx";
import Author from "./author/author.tsx";
import { useEffect, useState, type JSX } from "react";
import Preview from "../preview.tsx";
import GradientGenerator from "../../services/gradientGenerator.ts";
import CardService from "../../services/cardService.ts";
import { MaterialWithThumbnail } from "../../types/MaterialWithThumbnail.ts";
import BorderColorBlur from "../styling/borderColorBlur.tsx";

function Card({
  material: materialWithThumbnail,
}: {
  material: MaterialWithThumbnail;
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
      materialWithThumbnail.material.id.toString(),
    );
    const images = cardService.getImages(json.preview);
    setPreviewImage(images);
    setPreview(json);
  };

  const imageElement = image ? (
    <img
      src={image}
      onClick={togglePreview}
      className="thumbnail sm:h-full cursor-pointer object-cover object-top transition-transform duration-300 hover:scale-105 md:w-[400px] lg:w-[600px]"
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
        materialWithThumbnail.material.id.toString(),
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
        className="m-4 rounded-lg opacity-0 shadow-lg transition-opacity duration-700 md:mx-10 md:mb-10"
        id={materialWithThumbnail.material.id.toString()}
      >
        <BorderColorBlur>
          <div className="h-[25vh] sm:h-[45vh] overflow-hidden grid md:grid-cols-[2fr_3fr] grid-cols-[40%_auto] text-sm sm:grid-cols-2 bg-white rounded-lg">
            <div className="overflow-hidden border-r sm:row-span-2">
              {imageElement}
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-r-lg border-slate-100 bg-white p-4 md:p-10 md:border-t-0">
              <div className="flex flex-col">
                <div className="text-lg md:text-2xl">
                  {materialWithThumbnail.material.title}
                </div>
                <div className="md:text-base">{materialWithThumbnail.material.description}</div>
              </div>
              <p className="text-emerald-500 md:text-3xl">
                {Number(materialWithThumbnail.material.price / 100).toFixed(2)}{" "}
                €
              </p>
            </div>
            <div className="col-span-2 border-t sm:border-none sm:col-start-2 px-4 p-2 md:p-10 mt-auto flex">
              <div className="self-center">
                <ActionButtons
                  id={materialWithThumbnail.material.id.toString()}
                  title={materialWithThumbnail.material.title}
                  authorId={materialWithThumbnail.material.author_id}
                  isMine={materialWithThumbnail.material.file_path}
                ></ActionButtons>
              </div>
              <div className="ml-auto self-end">
                <Author
                  authorId={materialWithThumbnail.material.author_id}
                  published={materialWithThumbnail.material.date_published}
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
