import ActionButtons from "./action-buttons/action-buttons"

interface PreviewProps {
  material: any;
  images: string[];
}

export default function Preview({ material, images }: PreviewProps) {
  const _images = images.map((img, index) => <img src={img} alt="" key={index} />)

  return (
    <div className="fixed top-0 h-screen w-screen backdrop-blur-sm z-50">
      <div className="flex justify-center items-center h-full">
        {!material && <div>lädt...</div>}
        {material &&
          <div className="flex flex-col sm:flex-row bg-white p-2 md:p-10 border rounded-lg shadow-lg gap-5 mx-6 md:mx-10">
            <div className="overflow-scroll h-[50vh] md:h-[75vh]">
              {_images}
            </div>
            <div className="flex flex-col gap-5">
              <div className="xl:text-4xl text-2xl">
                {material.material.title}
              </div>
              <hr />
              <div>
                {material.material.description}
              </div>
              <div className="flex gap-x-10">
                <p className="text-3xl text-emerald-500">{Number((material.material.price) / 100).toFixed(2)} €</p>
                <ActionButtons id={material.material.id} authorId={material.material.author_id} isMine={material.material.file_path} />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
