import { describe, it, expect } from "vitest";
import { isValidPromoCodeFormat } from "./promoValidation";

describe("isValidPromoCodeFormat", () => {
  it("приймає код мінімальної довжини (4 символи)", () => {
    expect(isValidPromoCodeFormat("AB12")).toBe(true);
  });

  it("приймає код максимальної довжини (12 символів)", () => {
    expect(isValidPromoCodeFormat("ABCD1234EFGH")).toBe(true);
  });

  it("приймає код у змішаному регістрі після приведення до верхнього регістру", () => {
    expect(isValidPromoCodeFormat("SaVe2024")).toBe(true);
  });

  it("відхиляє порожній рядок", () => {
    expect(isValidPromoCodeFormat("")).toBe(false);
  });

  it("відхиляє закороткий код (3 символи)", () => {
    expect(isValidPromoCodeFormat("AB1")).toBe(false);
  });

  it("відхиляє задовгий код (13 символів)", () => {
    expect(isValidPromoCodeFormat("ABCD1234EFGHI")).toBe(false);
  });

  it("відхиляє код з пробілом", () => {
    expect(isValidPromoCodeFormat("AB 12")).toBe(false);
  });

  it("відхиляє код зі спеціальним символом", () => {
    expect(isValidPromoCodeFormat("AB-12")).toBe(false);
  });
});
