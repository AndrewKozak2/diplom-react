// Чисті функції розрахунку кошика, винесені для навчальної лабораторної роботи №1.

export function getCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateCartTotal(cart, discountPercent = 0) {
  const subtotal = getCartSubtotal(cart);
  const discount = subtotal * (discountPercent / 100);
  return subtotal - discount;
}

export function averageItemPrice(cart) {
  if (cart.length === 0) return 0;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return total / cart.length;
}
