import { customFetch } from "../actions/customFetch";
import {
  useAccessTokenStore,
  useCartStore,
  useErrorStore,
} from "../store";

class CartService {

  removeItem(id: string) {
    return customFetch(`/api/cart/${id}`, {
      method: "DELETE",
    });
  }

  async getItems(userId: string) {
    const res = await customFetch(`/api/cart?id=${userId}`, {
      method: "GET",
    });
    const data = await res.json();
    useCartStore.setState({ numberOfCartItems: data.length });
    return data;
  }

  addItem = async (id: string) => {
    const res = await customFetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ materialId: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const numberOfItems = await res.json();
    useCartStore.setState({ numberOfCartItems: numberOfItems });
    return res;
  };

  buyMaterial = async (materialIds: string[]) => {
    const res = await customFetch("/api/cart/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ materialIds: materialIds }),
    });
    const body = await res.json();
    if (body && body.url) {
      this.navigateToStripeCheckout(body.url);
    } else {
      useErrorStore
        .getState()
        .pushError({ message: "Etwas ist schief gelaufen", code: 400 });
    }
  };

  navigateToStripeCheckout = (url: string) => {
    window.location.href = url;
  };
}

export default CartService;
