import { useAccessTokenStore, useUserStore } from '../store';

class CartService {
  user = useUserStore.getState().user;

  removeItem(id: string) {
    return fetch(`http://localhost:3000/users/${this.user.id}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getItems() {
    const res = fetch(`http://localhost:3000/users/${this.user.id}/cart`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return res;
  }
}

export default CartService;
