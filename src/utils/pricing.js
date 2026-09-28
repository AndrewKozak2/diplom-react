// Чисті функції розрахунку кошика, винесені для навчальної лабораторної роботи №1.

export function getCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function applyDiscount(subtotal, discountPercent) {
  return subtotal * (1 - discountPercent / 100);
}

export function calculateCartTotal(cart, discountPercent = 0) {
  const subtotal = getCartSubtotal(cart);
  return applyDiscount(subtotal, discountPercent);
}

export function averageItemPrice(cart) {
  if (cart.length === 0) return 0;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return total / cart.length;
}
