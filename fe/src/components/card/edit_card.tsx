import Author from "./author/author.tsx";
import { useEffect, useState } from "react";
import { MaterialWithThumbnail } from "../../types/MaterialWithThumbnail.ts";
import { Form, useParams } from "react-router-dom";
import CheckMarkIcon from "../../assets/icons/icons8-checkmark-48.png";
import CardService from "../../services/cardService.ts";
import NoData from "../materials/noData.tsx";
import Price from "../materials/addMaterial/price.tsx";

function EditMaterial(): JSX.Element {
  const [materialWithThumbnail, setMaterialWithThumbnail] =
    useState<MaterialWithThumbnail>({} as MaterialWithThumbnail);
  const [image, setImage] = useState<string | null>(null);
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

  const imageElement = image && (
    <img
      src={image}
      className="thumbnail rounded-t-lg md:w-[400px] md:rounded-l-lg md:rounded-tr-none lg:w-[600px]"
      alt="Thumbnail"
    />
  );

  return (
    <>
      {!materialWithThumbnail.material ? (
        <NoData />
      ) : (
        <div
          id={materialWithThumbnail.material.id.toString()}
          className="module-border-wrap m-4 flex flex-col rounded-lg shadow-lg transition-opacity duration-700 md:mx-10 md:mb-10 md:flex-row"
        >
          <div className="rounded-lg bg-white md:rounded-r-none">
            {imageElement}
          </div>
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t border-slate-100 bg-white p-10 md:rounded-r-lg md:rounded-bl-none md:border-l md:border-t-0">
            <Form method="patch">
              <div className="flex flex-col gap-2 mb-10">
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
            </Form>
          </div>
        </div>
      )}
    </>
  );
}

export default EditMaterial;
