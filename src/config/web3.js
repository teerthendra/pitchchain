export const getProvider = () => {
  if (!window.ethereum) return null;
  return window.ethereum;
};
