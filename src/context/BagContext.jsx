import React, { createContext, useContext, useEffect, useState } from 'react';

const BagContext = createContext();

export const useBag = () => useContext(BagContext);

export const BagProvider = ({ children }) => {
  const [bagItems, setBagItems] = useState(() => {
    const storedItems = localStorage.getItem('bagItems');
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const addToBag = (product) => {
    setBagItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

  };

  const clearBag = () => {
    setBagItems([]);
    localStorage.removeItem('bagItems');
  };


  const removeFromBag = (productId) => {
    setBagItems((prev) => prev.filter(item => item.id !== productId));
  };

  useEffect(() => {
    localStorage.setItem('bagItems', JSON.stringify(bagItems));
  }, [bagItems]);

  return (
    <BagContext.Provider value={{ bagItems, setBagItems, addToBag, removeFromBag, clearBag }}>
      {children}
    </BagContext.Provider>
  );
};