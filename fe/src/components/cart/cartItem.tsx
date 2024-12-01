import { useState } from "react";
import { MaterialWithThumbnail } from "../../types/MaterialWithThumbnail";
import CartService from "../../services/cart.service";
import { useCartStore } from "../../store";

interface CartItemProps {
  item: MaterialWithThumbnail;
  cartService: CartService;
}

export default function CartItem({ item, cartService }: CartItemProps) {
  const [loading, setLoading] = useState(false);

  const removeItem = async (id: string) => {
    setLoading(true);
    const res = await cartService.removeItem(id)
    const data = await res.json()
    setLoading(false);
    useCartStore.getState().updateCart(data);
  }

  if (loading) {
    return (
      <div className="border border-slate-200 rounded-lg">
        <div className="p-28 flex justify-center">
          <div className="animate-spin w-20">|</div>
        </div>
      </div>
    )
  }

  const image = item.thumbnail
    ? item.thumbnail.data
      ? URL.createObjectURL(new Blob([new Uint8Array(item.thumbnail.data)], { type: 'image/png' }))
      : null
    : null;

  const imageElement = image
    ? <img src={image} className="" alt="Thumbnail" />
    : <div className="bg-blue-400"></div>;

  return (
    <div className="border border-slate-200 rounded-lg">
      <div className="grid grid-cols-2">
        <div className="m-10">
          <div>
            Material: <p className="text-2xl">{item.material.title}</p>
          </div>
          <div>
            Preis: <p className="text-3xl text-emerald-500">{Number((item.material.price) / 100).toFixed(2)} €</p>
          </div>
        </div>
        <div className="m-4">
        { imageElement }
        </div>
      </div>
      <div className="flex my-2">
      <div className="ml-auto">
        <button onClick={() => removeItem(item.material.id.toString())} className="mr-2 border border-slate-200 rounded-md px-2 hover:bg-red-400">
          Entfernen
        </button>
        </div>
      </div>
    </div>
  )
}
