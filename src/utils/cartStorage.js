export async function loadCartFromDB() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:3000/api/cart/load", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to load cart");

    const data = await res.json();
    localStorage.setItem("cart", JSON.stringify(data.cart));
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error loading cart from DB:", error);
  }
}

// ✅ Зберегти кошик
export async function saveCartToDB() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  try {
    const res = await fetch("http://localhost:3000/api/cart/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart }),
    });

    if (!res.ok) throw new Error("Failed to save cart");
  } catch (error) {
    console.error("Error saving cart to DB:", error);
  }
}
