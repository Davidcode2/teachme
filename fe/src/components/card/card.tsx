import sampleImage from "../../assets/exampleMaterialThumbnail.png"
import ActionButtons from "../action-buttons/action-buttons.tsx"
import Author from "../author/author.tsx"
import Material from "../../DTOs/material.ts"

function Card({material}): JSX.Element {
  return (
    <div className="m-10 rounded-lg border-slate-100 border flex flex-col md:flex-row shadow-lg">
      <img src={sampleImage} className="w-[400px] rounded-lg" alt="SampleImage" />
      <div className="p-10 flex flex-col gap-4 overflow-auto border-l border-slate-100">
        <div className="flex flex-col">
          <div className="text-2xl">{material.title}</div>
          <div>Description Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.</div>
        </div>
        <div className="flex mt-auto">
          <div className="self-end">
            <ActionButtons></ActionButtons>
          </div>
          <div className="ml-auto self-end">
            <Author author={material.author} published={new Date()} ></Author>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
