import { describe, it, expect } from "vitest";
import { calculateCartTotal, averageItemPrice } from "./pricing";

describe("calculateCartTotal", () => {
  it("застосовує знижку до підсумкової суми кошика", () => {
    const cart = [{ price: 100, quantity: 2 }]; // subtotal = 200
    expect(calculateCartTotal(cart, 10)).toBe(180);
  });

  it("повертає повну суму без знижки", () => {
    const cart = [{ price: 50, quantity: 1 }];
    expect(calculateCartTotal(cart, 0)).toBe(50);
  });
});

describe("averageItemPrice", () => {
  it("повертає 0 для порожнього кошика", () => {
    expect(averageItemPrice([])).toBe(0);
  });

  it("рахує середню ціну товарів у кошику", () => {
    const cart = [{ price: 100 }, { price: 200 }];
    expect(averageItemPrice(cart)).toBe(150);
  });
});
