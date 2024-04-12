import sampleImage from "../../assets/exampleMaterialThumbnail.png"
import ActionButtons from "../action-buttons/action-buttons.tsx"
import Author from "../author/author.tsx"
import Material from "../../DTOs/material.ts"

function Card({ material }): JSX.Element {

  const image = material.thumbnail.data ? URL.createObjectURL(new Blob([new Uint8Array(material.thumbnail.data)], { type: 'image/png' })) : sampleImage;

  return (
    <div className="m-4 md:m-10 rounded-lg border-slate-100 border flex flex-col md:flex-row shadow-lg">
      <img src={image} className="w-[400px] rounded-lg" alt="SampleImage" />
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
  )
}

export default Card
