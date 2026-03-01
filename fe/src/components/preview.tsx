import ActionButtons from "./card/action-buttons/action-buttons";
import SpinnerGif from "../assets/icons/icons8-spinnkreis.gif";

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
    <div className="fixed top-0 left-0 z-50 h-screen w-screen backdrop-blur-sm">
      <div className="flex h-full items-center justify-center">
        {!material && (
          <div>
            <img src={SpinnerGif} />
          </div>
        )}
        {material && (
          <div className="border-border dark:bg-surface-raised bg-surface-base relative mx-6 flex max-h-[90%] flex-col gap-5 rounded-lg border p-2 shadow-lg md:mx-10 md:flex-row md:p-10 lg:max-w-[80vw]">
            <button
              className="text-text-muted hover:text-alert absolute top-2 right-0 rounded-lg px-4"
              onClick={() => setShowPreview(false)}
            >
              <div className="font-handwriting text-sm">X</div>
            </button>
            <div className="h-[50vh] overflow-auto md:h-[75vh] lg:w-1/2">
              {_images}
            </div>
            <div className="flex flex-col gap-5 md:w-1/2">
              <div className="text-2xl xl:text-4xl">
                {material.material.title}
              </div>
              <hr className="text-border" />
              <div className="max-h-32 overflow-auto text-sm md:max-h-none lg:text-base">
                {material.material.description}
              </div>
              <div className="flex items-center gap-x-10">
                <p className="text-success text-3xl">
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
