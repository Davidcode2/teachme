import sampleImage from "../assets/exampleMaterialThumbnail.png"
export default function Preview({ material, images }) {

  console.log(material);
  return (
    <div className="fixed top-0 h-screen w-screen backdrop-blur-sm">
      <div className="flex justify-center items-center m-20">
        {!material
          ? <div>lädt...</div>
          :
          <div className="flex bg-white p-10 border rounded-lg shadow-lg gap-5">
            <div className="overflow-scroll h-[75vh]">
              {images.map((img, index) => <img src={img} alt="" key={index} />)}
            </div>
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
