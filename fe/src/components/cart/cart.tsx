import bag from "../../assets/icons/icons8-bag-64.png"
import sampleImage from "../../assets/exampleMaterialThumbnail.png"
import { useEffect, useState } from "react";
import { useAccessTokenStore, useUserStore } from "../../store";
import CartService from "../../services/cart.service";
import Card from "../card/card";

export default function Cart(): JSX.Element {
  const [cartItems, setCartItems] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const user = useUserStore.getState().user;
  const cartService = new CartService();

  const getItems = () => {
    cartService.getItems(user.id)
      .then((res) => res.json())
      .then((data) => {
        setSpinner(false);
        setCartItems(data);
      });
  }

  useEffect(() => {
    getItems();
  });

  const removeItem = (id: string) => {
    cartService.removeItem(id, user.id);
  }

  if (!spinner && cartItems.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center gap-4 border border-slate-200 rounded-lg p-10 justify-center">
          <div>Noch nichts in der Tasche</div>
          <div>{String(spinner)}</div>
          <img src={bag} alt="" width="30" />
        </div>
      </>
    )
  } else if (spinner) {
    return (
      <div className="m-20"><img className="animate-spin" src={bag} alt="" /></div>
    )

  }
  return (
    <div className="flex flex-col gap-4">
      {cartItems.map((item, index) => {
        return (
          <div className="border border-slate-200 rounded-lg" key={index}>
            <div className="grid grid-cols-[400px_200px]">
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
      <button className="border border-slate-200 rounded-md p-2 bg-fuchsia-100 hover:bg-fuchsia-200">Checkout</button>
    </div>

  )

}
