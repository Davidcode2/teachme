import ActionButtons from "./action-buttons/action-buttons"
import SpinnerGif from '../assets/icons/icons8-spinner.gif';

interface PreviewProps {
  material: any;
  images: string[];
  setShowPreview: (show: boolean) => void;
}

export default function Preview({ material, images, setShowPreview }: PreviewProps) {
  const _images = images.map((img, index) => <img src={img} alt="" key={index} />)

  return (
    <div className="fixed left-0 top-0 h-screen w-screen backdrop-blur-sm z-50">
      <div className="flex justify-center items-center h-full">
        {!material && <div><img src={SpinnerGif} /></div>}
        {material &&
          <div className="relative flex flex-col sm:flex-row bg-white p-2 md:p-10 border rounded-lg shadow-lg gap-5 mx-6 md:mx-10 lg:max-w-[80vw]">
            <button className="absolute right-0 top-2 rounded-lg px-4" onClick={() => setShowPreview(false)}>
              <div className="">X</div>
            </button>
            <div className="lg:w-1/2 overflow-scroll h-[50vh] md:h-[75vh]">
              {_images}
            </div>
            <div className="lg:w-1/2 flex flex-col gap-5">
              <div className="xl:text-4xl text-2xl">
                {material.material.title}
              </div>
              <hr />
              <div className="max-h-20 lg:max-h-none overflow-auto">
                {material.material.description}
              </div>
              <div className="flex gap-x-10">
                <p className="text-3xl text-emerald-500">{Number((material.material.price) / 100).toFixed(2)} €</p>
                <ActionButtons id={material.material.id} authorId={material.material.author_id} isMine={material.material.file_path} title={material.material.title} />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
