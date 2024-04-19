import { useLoaderData } from "react-router-dom";
import ActionButtons from "./action-buttons/action-buttons"

export default function SharedPreview() {
  const data: any = useLoaderData();
  const _images = data.images.map((img: string, index: number) => <img src={img} alt="" key={index} />)

  return (
    <div className="fixed top-0 h-screen w-screen backdrop-blur-sm z-50">
      <div className="flex justify-center items-center h-full">
        {!data.material && <div>lädt...</div>}
        {data.material &&
          <div className="flex flex-col sm:flex-row bg-white p-2 md:p-10 border rounded-lg shadow-lg gap-5 mx-6 md:mx-10">
            <div className="overflow-scroll h-[50vh] md:h-[75vh]">
              {_images}
            </div>
            <div className="flex flex-col gap-5">
              <div className="xl:text-4xl text-2xl">
                {data.material.material.title}
              </div>
              <hr />
              <div>
                {data.material.material.description}
              </div>
              <div className="flex gap-x-10">
                <p className="text-3xl text-emerald-500">{Number((data.material.material.price) / 100).toFixed(2)} €</p>
                <ActionButtons id={data.material.material.id} isMine={data.material.material.file_path} />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
