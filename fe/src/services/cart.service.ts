import { useAccessTokenStore, useUserStore } from '../store';

class CartService {
  user = useUserStore.getState().user;

  removeItem(id: string) {
    return fetch(`/api/cart/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: this.user.id}),
    });
  }

  getItems() {
    const res = fetch(`/api/cart?id=${this.user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return res;
  }

  buyMaterial = async (materialIds: string[]) => {
    const res = await fetch('/api/cart/buy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'materialId': materialIds })
    });
    const body = await res.json()
    window.location.href = body.url
  }
}

export default CartService;
