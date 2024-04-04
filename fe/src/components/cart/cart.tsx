import bag from "../../assets/icons/icons8-bag-64.png"
import { useEffect, useState } from "react";
import CartService from "../../services/cart.service";
import CartItem from "./cartItem";

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
      {cartItems.map((item, index) => <div className="w-[500px]"><CartItem item={item} index={index} cartService={cartService} setCartItems={setCartItems} /></div>)}
      <button onClick={() => toCheckout(cartItems.map((item) => item.id))} className="border border-slate-200 rounded-md p-2 bg-fuchsia-100 hover:bg-fuchsia-200">Checkout</button>
    </div>
  )

}
