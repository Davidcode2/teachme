import Author from "./author/author.tsx";
import { useEffect, useState } from "react";
import { MaterialWithThumbnail } from "../../types/MaterialWithThumbnail.ts";
import { useParams } from "react-router-dom";
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
  const [value, setValue] = useState(``);

  const formatCurrency = (value: string) => {
    if (!value) return "0,00";
    return (Number(value) / 100).toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const fetchMaterial = async () => {
      const material = (await cardService.getMaterialWithThumbnail(id!))[0];
      console.log(material);
      const images = cardService.getImages([material.thumbnail]);
      setImage(images[0]);
      setMaterialWithThumbnail(material);
      setValue(material.material.price.toString());
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setValue(rawValue);
  };

  return (
    <>
      {!materialWithThumbnail.material ? (
        <NoData />
      ) : (
        <div
          id={materialWithThumbnail.material.id.toString()}
          className="module-border-wrap m-4 flex flex-col rounded-lg shadow-lg transition-opacity duration-700 md:mx-10 md:mb-10 md:flex-row"
        >
          <div className="rounded-lg bg-white">{imageElement}</div>
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t border-slate-100 bg-white p-10 md:rounded-r-lg md:rounded-bl-none md:border-l md:border-t-0">
            <div className="flex flex-col gap-2">
              <input
                className="rounded-lg border border-slate-200 p-2 text-2xl"
                placeholder={`${materialWithThumbnail.material.title}`}
              />
              <input
                className="rounded-lg border border-slate-200 p-2"
                placeholder={`${materialWithThumbnail.material.description}`}
              />
              <Price initialValue={materialWithThumbnail.material.price.toString()}/>
            </div>
            <div className="mt-auto flex">
              <div className="self-center">
                <button>
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
        </div>
      )}
    </>
  );
}

export default EditMaterial;
