import { Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import CartService from "../../services/cart.service";
import { useCartStore } from "../../store";
import MaterialInDto from "../../DTOs/materialInDto";

interface CartItemProps {
  item: MaterialInDto;
  cartService: CartService;
}

export default function CartItem({ item, cartService }: CartItemProps) {
  const [loading, setLoading] = useState(false);

  const removeItem = async (id: string) => {
    setLoading(true);
    const res = await cartService.removeItem(id);
    const data = await res.json();
    setLoading(false);
    useCartStore.getState().updateCart(data);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const rootElement = document.getElementById(
        item.id.toString() + "-cart-item",
      );
      rootElement?.classList.add("opacity-100");
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="border-border rounded-lg border">
        <div className="flex justify-center p-28">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
      </div>
    );
  }

  const image = item.thumbnail
    ? item.thumbnail.data
      ? URL.createObjectURL(
          new Blob([new Uint8Array(item.thumbnail.data)], {
            type: "image/png",
          }),
        )
      : null
    : null;

  const imageElement = image ? (
    <img src={image} className="" alt="Thumbnail" />
  ) : (
    <div className="bg-accent"></div>
  );

  return (
    <div
      id={item.id.toString() + "-cart-item"}
      className="border-border dark:bg-surface-raised rounded-lg border opacity-0 shadow-md transition-opacity duration-700"
    >
      <div className="grid grid-cols-2">
        <div className="m-10">
          <div>
            Material: <p className="text-2xl">{item.title}</p>
          </div>
          <div>
            Preis:{" "}
            <p className="text-success text-3xl">
              {Number(item.price / 100).toFixed(2)} €
            </p>
          </div>
        </div>
        <div className="m-4">{imageElement}</div>
      </div>
      <div className="my-2 flex">
        <div className="ml-auto">
          <button
            onClick={() => removeItem(item.id.toString())}
            className="border-border hover:bg-alert mr-2 cursor-pointer rounded-md px-2"
          >
            <Trash2 className="h-6 w-6 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
}
