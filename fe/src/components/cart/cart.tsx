import bag from "../../assets/icons/icons8-bag-64.png";
import arrowIcon from "../../assets/icons/icons8-arrow-50.png";
import { useEffect, useState, type JSX } from "react";
import CartService from "../../services/cart.service";
import CartItem from "./cartItem";
import { useCartStore } from "../../store";
import Skeleton from "../card/skeleton";
import MaterialInDto from "../../DTOs/materialInDto";
import Material from "../../DTOs/material";
import { useAuth } from "react-oidc-context";

export default function Cart(): JSX.Element {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartService = new CartService();
  const { cart, numberOfCartItems } = useCartStore();
  const auth = useAuth();

  const getItems = async () => {
    const data = await cartService.getItems(
      auth.user?.profile?.sub!,
    );
    return data;
  };

  useEffect(() => {
    const populateItems = async () => {
      const items = await getItems();
      setCartItems(items);
      setLoading(false);
    };
    populateItems();
  }, [cart, numberOfCartItems]);

  const toCheckout = (ids: string[]) => {
    cartService.buyMaterial(ids);
  };

  const noItemsInCart = (
    <>
      <div className="m-0 mt-10 flex flex-col items-center justify-center gap-4 rounded-lg border border-slate-200 p-10 sm:m-10">
        <div>Noch nichts in der Tasche</div>
        <img src={bag} alt="" width="30" />
      </div>
    </>
  );

  if (loading) {
    return <Skeleton id={crypto.randomUUID()} />;
  } else if (!cartItems || cartItems.length === 0) {
    return noItemsInCart;
  }

  const checkoutButton = (
    <button
      onClick={() =>
        toCheckout(cartItems.map((item: Material) => item.id.toString()))
      }
      className="flex justify-center rounded-md bg-emerald-500 p-2 shadow-md hover:bg-emerald-600 hover:shadow-sm"
    >
      <img width="30" src={arrowIcon} />
    </button>
  );

  return (
    <div className="m-0 mt-10 flex flex-col gap-4 sm:m-10 md:max-w-[600px]">
      {cartItems &&
        cartItems.map((item: MaterialInDto) => (
          <CartItem key={item.id} item={item} cartService={cartService} />
        ))}
      {cartItems.length > 0 && checkoutButton }
    </div>
  );
}
