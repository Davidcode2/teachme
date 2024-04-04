import { useState } from "react";
import sampleImage from "../../assets/exampleMaterialThumbnail.png"

export default function CartItem({ item, index, cartService, setCartItems }) {
  const [loading, setLoading] = useState(false);

  const removeItem = async (id: string) => {
    setLoading(true);
    const res = await cartService.removeItem(id)
    const data = await res.json()
    setLoading(false);
    setCartItems(data)
  }

  if (loading) {
    return (
      <div className="border border-slate-200 rounded-lg">
        <div className="p-28">
          <div className="animate-spin">|</div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-lg" key={index}>
      <div className="grid grid-cols-2">
        <div className="m-10">
          <div>
            Material: <p className="text-2xl">{item.title}</p>
          </div>
          <div>
            Preis: <p className="text-3xl text-emerald-500">{Number((item.price) / 100).toFixed(2)} €</p>
          </div>
        </div>
        <div className="m-4">
          <img src={sampleImage} alt="sample" />
        </div>
      </div>
      <div className="flex mx-10 my-2">
        <button onClick={() => removeItem(item.id)} className="border border-slate-200 rounded-md px-2 hover:bg-red-400">
          Entfernen
        </button>
      </div>
    </div>
  )
}
