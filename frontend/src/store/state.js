import create from 'zustand';

export const useGlobalState = create((set) => {
  return {
    isLogout: false,
    logoutSet: () =>
      set(() => {
        return {
          isLogout: true,
        };
      }),
    logoutUnset: () =>
      set(() => {
        return {
          isLogout: false,
        };
      }),
  };
});
