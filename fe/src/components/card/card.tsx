import sampleImage from "../../assets/exampleMaterialThumbnail.png"
import ActionButtons from "../action-buttons/action-buttons.tsx"
import Author from "../author/author.tsx"
import Material from "../../DTOs/material.ts"
import { useState } from "react";
import Preview from "../preview.tsx";

function Card({ material }): JSX.Element {
  const [showPreview, setShowPreview] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);

  const image = material.thumbnail.data
    ? URL.createObjectURL(new Blob([new Uint8Array(material.thumbnail.data)], { type: 'image/png' }))
    : sampleImage;

  const togglePreview = async () => {
    setShowPreview(true);
    const res = await fetch(`/api/materials/${material.material.id}`, {
      method: 'GET',
    });
    const json = await res.json();
    console.log(json);
  }

  if (!eventListenerRegistered && showPreview === true) {
    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('bg-white')) return;
      if (e.target.closest('.thumbnail')) return;
      setShowPreview(false);
    });
    setEventListenerRegistered(true);
  }

  return (
    <>
      {showPreview ? <div className="fixed w-screen h-screen top-0"><Preview /></div> : <></>}
      <div className="m-4 md:m-10 rounded-lg border-slate-100 border flex flex-col md:flex-row shadow-lg">
        <img src={image} onClick={togglePreview} className="thumbnail w-[400px] rounded-l-lg" alt="Thumbnail" />
        <div className="p-10 flex flex-col flex-1 gap-4 overflow-auto md:border-l md:border-t-0 border-t border-slate-100">
          <div className="flex flex-col">
            <div className="text-2xl">{material.material.title}</div>
            <div>{material.material.description}</div>
          </div>
          <div className="flex mt-auto">
            <div className="self-center">
              <ActionButtons id={material.material.id} path={material.material.file_path}></ActionButtons>
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
