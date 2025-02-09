import { useAuth } from "react-oidc-context";
import { customFetch } from "../actions/customFetch";
import {
  useAccessTokenStore,
  useCartStore,
  useErrorStore,
} from "../store";
import { parseIdJwt } from "./authService";

class CartService {

  removeItem(id: string) {
    return fetch(`/api/cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getItems(userId: string, access_token: string) {
    const res = await fetch(`/api/cart?id=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 401) {
      useErrorStore
        .getState()
        .pushError({ message: "Nicht authorisiert. Laden Sie die Seite neu", code: 401 });
      return;
    }
    const data = await res.json();
    useCartStore.setState({ numberOfCartItems: data.length });
    return data;
  }

  addItem = async (id: string, access_token: string, userId: string) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId, materialId: id }),
    });
    const numberOfItems = await res.json();
    useCartStore.setState({ numberOfCartItems: numberOfItems });
    return res;
  };

  buyMaterial = async (materialIds: string[]) => {
    const res = await fetch("/api/cart/buy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ materialId: materialIds }),
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
