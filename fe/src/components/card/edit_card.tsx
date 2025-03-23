import Author from "./author/author.tsx";
import { useEffect, useState, type JSX } from "react";
import { MaterialWithThumbnail } from "../../types/MaterialWithThumbnail.ts";
import { Form, useParams } from "react-router";
import CheckMarkIcon from "../../assets/icons/icons8-checkmark-48.png";
import CardService from "../../services/cardService.ts";
import SpinnerGif from "../../assets/icons/icons8-spinnkreis.gif";
import Price from "../materials/addMaterial/price.tsx";
import BorderColorBlur from "../styling/borderColorBlur.tsx";

function EditMaterial(): JSX.Element {
  const [materialWithThumbnail, setMaterialWithThumbnail] =
    useState<MaterialWithThumbnail>({} as MaterialWithThumbnail);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { id } = useParams();
  const cardService = new CardService();

  useEffect(() => {
    const fetchMaterial = async () => {
      const material = (await cardService.getMaterialWithThumbnail(id!))[0];
      console.log(material);
      const images = cardService.getImages([material.thumbnail]);
      setImage(images[0]);
      setMaterialWithThumbnail(material);
    };
    fetchMaterial();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const fileSelectedElement = (
    <div className="mx-4">
      <div className="relative bottom-6 text-center text-xl font-bold text-stone-500">
        Du hast eine neue Datei zum Hochladen ausgewählt
      </div>
      <div className="mx-auto flex w-fit cursor-pointer justify-between gap-5 rounded-lg border border-slate-100 bg-white/20 p-2">
        <div className="p-1">{file?.name}</div>
        <button
          className="p-1 font-handwriting text-slate-500 hover:text-red-500"
          onClick={() => setFile(null)}
        >
          X
        </button>
      </div>
    </div>
  );

  const noFileSelectedElement = (
    <div className="flex cursor-pointer justify-between gap-5 rounded-lg border border-slate-100 bg-white/30 p-4 text-center text-xl font-bold text-stone-500 hover:bg-white/50">
      Wähle hier eine neue Datei aus
    </div>
  );

  const fileSelectedImageElement = image && (
    <div className="group relative flex max-h-[250px] items-center justify-center md:max-h-none">
      <div className="absolute z-10">
        {!file?.name && noFileSelectedElement}
        {file?.name && fileSelectedElement}
      </div>
      <img
        src={image}
        className={`thumbnail cursor-pointer rounded-t-lg transition-transform duration-300 group-hover:scale-105 md:w-[300px] md:rounded-l-lg md:rounded-tr-none lg:w-[400px] ${file?.name ? "blur-xl" : "blur-sm"}`}
        alt="Thumbnail"
      />
    </div>
  );

  return (
    <>
      {!materialWithThumbnail.material ? (
        <div className="flex h-screen w-screen items-center justify-center">
          <img src={SpinnerGif} />
        </div>
      ) : (
        <div
          id={materialWithThumbnail.material.id.toString()}
          className="m-4 lg:mx-auto rounded-lg shadow-lg transition-opacity duration-700 md:mx-20 md:mb-10 lg:w-2/3"
        >
          <BorderColorBlur>
            <Form
              method="patch"
              encType="multipart/form-data"
              className="flex flex-col md:flex-row"
            >
              <div className="overflow-hidden rounded-t-lg bg-white md:rounded-l-lg md:rounded-r-none">
                <label htmlFor="file-edit-input">
                  {fileSelectedImageElement}
                </label>
                <input
                  id="file-edit-input"
                  className="hidden h-fit w-full min-w-0 rounded-md border border-slate-200 px-4 py-2"
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t border-slate-100 bg-white p-10 md:rounded-r-lg md:rounded-bl-none md:border-l md:border-t-0">
                <div className="flex flex-col gap-2">
                  <input
                    className="hidden"
                    name="id"
                    value={materialWithThumbnail.material.id.toString()}
                    readOnly
                  />
                  <input
                    className="max-w-fit rounded-lg border border-slate-200 p-2 text-2xl"
                    type="text"
                    placeholder={`${materialWithThumbnail.material.title}`}
                    defaultValue={materialWithThumbnail.material.title}
                    name="title"
                  />
                  <textarea
                    className="max-w-fit rounded-lg border border-slate-200 p-2"
                    cols={40}
                    rows={5}
                    placeholder={`${materialWithThumbnail.material.description}`}
                    defaultValue={materialWithThumbnail.material.description}
                    name="description"
                  />
                  <Price
                    initialValue={materialWithThumbnail.material.price.toString()}
                  />
                </div>
                <div className="mt-auto flex">
                  <div className="self-center">
                    <button type="submit">
                      <img src={CheckMarkIcon} className="w-8" alt="" />
                    </button>
                  </div>
                  <div className="ml-auto self-end">
                    <Author
                      authorId={materialWithThumbnail.material.author_id}
                      published={materialWithThumbnail.material.date_published}
                    ></Author>
                  </div>
                </div>
              </div>
            </Form>
          </BorderColorBlur>
        </div>
      )}
    </>
  );
}

export default EditMaterial;
