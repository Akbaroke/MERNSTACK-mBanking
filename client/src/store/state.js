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

export const useGlobalStateLoader = create((set) => {
  return {
    isLoading: false,
    loadingSet: () =>
      set(() => {
        return {
          isLoading: true,
        };
      }),
    loadingUnset: () =>
      set(() => {
        return {
          isLoading: false,
        };
      }),
  };
});
