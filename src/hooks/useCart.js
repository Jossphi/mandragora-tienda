import { useState } from 'react';

/**
 * Simple cart state hook
 * Returns [count, addToCart] for global usage
 */
export function useCart() {
  const [count, setCount] = useState(0);

  const addToCart = (e) => {
    if (e) e.preventDefault();
    setCount((c) => c + 1);
  };

  return [count, addToCart];
}
