import bag from "../../assets/icons/icons8-bag-64.png"
import arrowIcon from '../../assets/icons/icons8-arrow-50.png';
import { useEffect, useState } from "react";
import CartService from "../../services/cart.service";
import CartItem from "./cartItem";
import { useCartStore } from "../../store";
import { MaterialWithThumbnail } from "../../types/MaterialWithThumbnail";

export default function Cart(): JSX.Element {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartService = new CartService();
  const { cart } = useCartStore();

  const getItems = async () => {
    const data = await cartService.getItems();
    setLoading(false);
    setCartItems(data);
  }

  useEffect(() => {
    getItems();
  }, [cart]);


  const toCheckout = (ids: string[]) => {
    cartService.buyMaterial(ids);
  }

  if (loading) {
    return (
      <div className="m-20 flex justify-center animate-pulse">
        <img className="animate-spin" src={bag} alt="" />
      </div>
    )
  } if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center gap-4 border border-slate-200 rounded-lg p-10 justify-center">
          <div>Noch nichts in der Tasche</div>
          <img src={bag} alt="" width="30" />
        </div>
      </>
    )
  }
  return (
    <div className="flex flex-col gap-4 md:max-w-[600px] m-10">
      {cartItems && cartItems.map((item: MaterialWithThumbnail, index) => <CartItem key={index} item={item} cartService={cartService} />)}
      <button
        onClick={() => toCheckout(cartItems.map((item: any) => item.id))}
        className="shadow-md rounded-md p-2 bg-emerald-500 hover:shadow-sm hover:bg-emerald-600 flex justify-center">
        <img width="30" src={arrowIcon} />
      </button>
    </div>
  )
}
