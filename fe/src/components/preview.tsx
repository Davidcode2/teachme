import ActionButtons from "./action-buttons/action-buttons";
import SpinnerGif from "../assets/icons/icons8-spinner.gif";

interface PreviewProps {
  material: any;
  images: string[];
  setShowPreview: (show: boolean) => void;
}

export default function Preview({
  material,
  images,
  setShowPreview,
}: PreviewProps) {
  const _images = images.map((img, index) => (
    <img src={img} alt="" key={index} />
  ));

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-screen backdrop-blur-sm">
      <div className="flex h-full items-center justify-center">
        {!material && (
          <div>
            <img src={SpinnerGif} />
          </div>
        )}
        {material && (
          <div className="relative mx-6 flex flex-col gap-5 rounded-lg border bg-white p-2 shadow-lg sm:flex-row md:mx-10 md:p-10 lg:max-w-[80vw]">
            <button
              className="absolute right-0 top-2 rounded-lg px-4"
              onClick={() => setShowPreview(false)}
            >
              <div className="">X</div>
            </button>
            <div className="h-[50vh] overflow-scroll md:h-[75vh] lg:w-1/2">
              {_images}
            </div>
            <div className="flex flex-col gap-5 lg:w-1/2">
              <div className="text-2xl xl:text-4xl">
                {material.material.title}
              </div>
              <hr />
              <div className="max-h-20 overflow-auto lg:max-h-none">
                {material.material.description}
              </div>
              <div className="flex gap-x-10">
                <p className="text-3xl text-emerald-500">
                  {Number(material.material.price / 100).toFixed(2)} €
                </p>
                <ActionButtons
                  id={material.material.id}
                  authorId={material.material.author_id}
                  isMine={material.material.file_path}
                  title={material.material.title}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
