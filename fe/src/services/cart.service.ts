import {
  useAccessTokenStore,
  useCartStore,
  useErrorStore,
  useUserStore,
} from "../store";

class CartService {
  user = useUserStore.getState().user;

  removeItem(id: string) {
    return fetch(`/api/cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: this.user?.id }),
    });
  }

  async getItems() {
    const res = await fetch(`/api/cart?id=${this.user?.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    useCartStore.setState({ numberOfCartItems: data.length });
    return data;
  }

  addItem = async (id: string) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: this.user?.id, materialId: id }),
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
