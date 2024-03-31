import bag from "../../assets/icons/icons8-bag-64.png"
import sampleImage from "../../assets/exampleMaterialThumbnail.png"
import { useEffect, useState } from "react";
import CartService from "../../services/cart.service";

export default function Cart(): JSX.Element {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartService = new CartService();

  const getItems = () => {
    cartService.getItems()
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setCartItems(data);
      });
  }

  useEffect(() => {
    getItems();
  }, []);

  const removeItem = (id: string) => {
    cartService.removeItem(id);
  }

  const toCheckout = (ids: string[]) => {
    cartService.buyMaterial(ids);
  }

  if (!loading && cartItems.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center gap-4 border border-slate-200 rounded-lg p-10 justify-center">
          <div>Noch nichts in der Tasche</div>
          <img src={bag} alt="" width="30" />
        </div>
      </>
    )
  } else if (loading) {
    return (
      <div className="m-20"><img className="animate-spin" src={bag} alt="" /></div>
    )

  }
  return (
    <div className="flex flex-col gap-4 md:max-w-[600px] ">
      {cartItems.map((item, index) => {
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
      })}
      <button onClick={() => toCheckout(() => cartItems.map((item) => item.id))} className="border border-slate-200 rounded-md p-2 bg-fuchsia-100 hover:bg-fuchsia-200">Checkout</button>
    </div>
  )

}
