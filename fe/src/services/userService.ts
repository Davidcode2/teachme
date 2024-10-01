import { useAccessTokenStore, useAvatarStore, useUserStore } from '../store';

export const UserService = {
  setUserAndAvatar: async function (user: any) {
    const setUser = useUserStore.getState().setUser;
    const avatar = await this.getAvatar(user.id);
    const setAvatar = useAvatarStore.getState().setAvatar;
    setAvatar(avatar);
    setUser(user);
  },

  getAvatar: async function (userId: string) {
    const response = await fetch(`/api/users/avatar/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.blob();
  },
};
