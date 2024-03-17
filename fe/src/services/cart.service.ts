import { useAccessTokenStore } from "../store";

class CartService {
  removeItem(id: string, userId: string) {
    return fetch(`http://localhost:3000/users/${userId}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getItems(userId: string) {
    const res = fetch(`http://localhost:3000/users/${userId}/cart`, {
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
