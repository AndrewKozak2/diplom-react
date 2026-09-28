import { describe, it, expect } from "vitest";
import { buildCustomCartItem, formatCustomOrderLabel } from "./customOrder";

describe("custom order pipeline", () => {
  it("формує коректний підпис позиції кастомної моделі", () => {
    const customModel = {
      id: "42",
      name: "Nissan GT-R",
      price: 25,
      bodyColor: "Matte Black",
      wheelColor: "Gold",
    };

    const item = buildCustomCartItem(customModel);
    const label = formatCustomOrderLabel(item);

    expect(label).toBe("Nissan GT-R (Custom) - Body: Matte Black, Wheels: Gold");
  });
});
