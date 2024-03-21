import { useAccessTokenStore, useUserStore } from '../store';

class CartService {
  user = useUserStore.getState().user;

  removeItem(id: string) {
    return fetch(`api/users/${this.user.id}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getItems() {
    const res = fetch(`/api/users/${this.user.id}/cart`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return res;
  }

  buyMaterial = async (materialId: string) => {
    const res = await fetch('/api/consumer/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'materialId': materialId, 'consumerId': this.user.consumerId })
    });
    console.log(this.user);
    console.log(this.user.consumerId);
    const body = await res.json()
    window.location.href = body.url
  }
}

export default CartService;
