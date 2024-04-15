export default function Preview({ material, images }) {
  const _images = images.map((img, index) => <img src={img} alt="" key={index} />)

  return (
    <div className="fixed top-0 h-screen w-screen backdrop-blur-sm">
      <div className="flex justify-center items-center h-full">
        {!material && <div>lädt...</div>}
        {material &&
          <div className="flex flex-col sm:flex-row bg-white p-10 border rounded-lg shadow-lg gap-5 mx-10 lg:mx-0">
            <div className="overflow-scroll h-[75vh]">
              {_images}
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