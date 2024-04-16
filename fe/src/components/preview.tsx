import ActionButtons from "./action-buttons/action-buttons"

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
            <div className="flex flex-col gap-5">
              <div className="xl:text-4xl text-2xl">
                {material.material.title}
              </div>
              <hr/>
              <div>
                {material.material.description}
              </div>
              <div className="flex gap-x-10">
                <p className="text-3xl text-emerald-500">{Number((material.material.price) / 100).toFixed(2)} €</p>
                <ActionButtons id={material.material.id} isMine={material.material.file_path} />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
