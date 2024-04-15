import sampleImage from "../assets/exampleMaterialThumbnail.png"
export default function Preview({ material, images }) {

  console.log(material);
  return (
    <div className="fixed top-0 h-screen w-screen backdrop-blur-sm">
      <div className="flex justify-center items-center h-full w-full">
        {!material
          ? <div>lädt...</div>
          : <div className="bg-white p-10 border rounded-lg shadow-lg">
            {images.forEach((img) => <img src={img} alt="" />)}
            <div>
              {material.material.title}
            </div>
            <div>
              {material.material.description}
            </div>
          </div>
        }
      </div>
    </div>
  )
}
