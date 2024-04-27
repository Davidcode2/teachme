import ActionButtons from "../action-buttons/action-buttons.tsx"
import Author from "../author/author.tsx"
import { useState } from "react";
import Preview from "../preview.tsx";
import GradientGenerator from "../../services/gradientGenerator.ts";
import CardService from "../../services/cardService.ts";

function Card({ material }: { material: any }): JSX.Element {
  const [showPreview, setShowPreview] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewImage, setPreviewImage] = useState(['']);
  const cardService = new CardService();
  const gradient = new GradientGenerator().randomGradient();

  const image = material.thumbnail
    ? material.thumbnail.data
      ? URL.createObjectURL(new Blob([new Uint8Array(material.thumbnail.data)], { type: 'image/png' }))
      : null
    : null;

  const togglePreview = async () => {
    setShowPreview(true);
    const json = await cardService.getPreview(material.material.id);
    const images = cardService.getImages(json.preview);
    setPreviewImage(images);
    setPreview(json);
    //Router(`/materials/id/${material.material.id}`);
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

  return (
    <>
      {showPreview && <Preview material={preview} images={previewImage} />}
      <div className="module-border-wrap m-4 md:mb-10 md:mx-10 rounded-lg flex flex-col md:flex-row shadow-lg">
        {imageElement}
        <div className="bg-white p-10 flex flex-col flex-1 gap-4 overflow-auto md:rounded-r-lg rounded-b-lg md:rounded-bl-none md:border-l md:border-t-0 border-t border-slate-100">
          <div className="flex flex-col">
            <div className="text-2xl">{material.material.title}</div>
            <div>{material.material.description}</div>
          </div>
          <div className="flex mt-auto">
            <div className="self-center">
              <ActionButtons id={material.material.id} isMine={material.material.file_path}></ActionButtons>
            </div>
            <div className="ml-auto self-end">
              <Author author={material.material.author} published={material.material.date_published} ></Author>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Card
