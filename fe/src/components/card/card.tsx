import ActionButtons from "../action-buttons/action-buttons.tsx"
import Author from "../author/author.tsx"
import { useEffect, useState } from "react";
import Preview from "../preview.tsx";
import GradientGenerator from "../../services/gradientGenerator.ts";
import CardService from "../../services/cardService.ts";
import { MaterialWithThumbnail } from "../../types/MaterialWithThumbnail.ts";

function Card({ material: materialWithThumbnail }: { material: MaterialWithThumbnail }): JSX.Element {
  const [showPreview, setShowPreview] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewImage, setPreviewImage] = useState(['']);
  const cardService = new CardService();
  const gradient = new GradientGenerator().randomGradient();

  const image = materialWithThumbnail.thumbnail
    ? materialWithThumbnail.thumbnail.data
      ? URL.createObjectURL(new Blob([new Uint8Array(materialWithThumbnail.thumbnail.data)], { type: 'image/png' }))
      : null
    : null;

  const togglePreview = async () => {
    setShowPreview(true);
    const json = await cardService.getPreview(materialWithThumbnail.material.id.toString());
    const images = cardService.getImages(json.preview);
    setPreviewImage(images);
    setPreview(json);
  }

  const imageElement = image
    ? <img src={image} onClick={togglePreview} className="thumbnail md:w-[400px] lg:w-[600px] rounded-t-lg md:rounded-tr-none md:rounded-l-lg" alt="Thumbnail" />
    : <div className={`thumbnail md:w-[400px] lg:w-[600px] h-[400px] rounded-lg lg:rounded-r-none`} style={{ backgroundImage: gradient }}></div>;

  if (!eventListenerRegistered && showPreview === true) {
    document.body.addEventListener('click', (e: any) => {
      if (e.target.closest('.bg-white')) return;
      if (e.target.closest('.thumbnail')) return;
      setShowPreview(false);
    });
    setEventListenerRegistered(true);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const rootElement = document.getElementById(materialWithThumbnail.material.id.toString());
      rootElement?.classList.add("opacity-100");
    }, 50);
    return () => { clearTimeout(timeout) }
  }, []);

  return (
    <>
      {showPreview && <Preview material={preview} images={previewImage} />}
      <div id={materialWithThumbnail.material.id.toString()} className="module-border-wrap m-4 md:mb-10 md:mx-10 rounded-lg flex flex-col md:flex-row shadow-lg transition-opacity duration-700 opacity-0">
        <div className="bg-white rounded-lg">
          {imageElement}
        </div>
        <div className="bg-white p-10 flex flex-col flex-1 gap-4 overflow-auto md:rounded-r-lg rounded-b-lg md:rounded-bl-none md:border-l md:border-t-0 border-t border-slate-100">
          <div className="flex flex-col">
            <div className="text-2xl">{materialWithThumbnail.material.title}</div>
            <div>{materialWithThumbnail.material.description}</div>
          </div>
          <p className="text-3xl text-emerald-500">{Number((materialWithThumbnail.material.price) / 100).toFixed(2)} €</p>
          <div className="flex mt-auto">
            <div className="self-center">
              <ActionButtons id={materialWithThumbnail.material.id.toString()} title={materialWithThumbnail.material.title} authorId={materialWithThumbnail.material.author_id} isMine={materialWithThumbnail.material.file_path}></ActionButtons>
            </div>
            <div className="ml-auto self-end">
              <Author authorId={materialWithThumbnail.material.author_id} published={materialWithThumbnail.material.date_published} ></Author>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Card
