export const getFromLocalStorage = (key) => {
  const storedItem = localStorage.getItem(key);
  return storedItem ? JSON.parse(storedItem) : null;
};

export const setToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
