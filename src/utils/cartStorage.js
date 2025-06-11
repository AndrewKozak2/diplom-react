export async function loadCartFromDB() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("https://truescale.up.railway.app/api/cart/load", {
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


export async function saveCartToDB() {
  const token = localStorage.getItem("token");
  if (!token) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.map((item) => ({
    ...item,
    quantity:
      typeof item.quantity === "number" && !isNaN(item.quantity) && item.quantity > 0
        ? item.quantity
        : 1,
    images: Array.isArray(item.images)
      ? item.images
      : item.image
      ? [item.image]
      : [],

    brand: item.brand || "Unknown",
    scale: item.scale || "1/64",
    name: item.name || "Unnamed",
    price: Number(item.price) || 0,
    id: item.id || item._id || ""
  }));


  try {
    const res = await fetch("https://truescale.up.railway.app/api/cart/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart }),
    });

    if (!res.ok) throw new Error("Failed to save cart");
  } catch (error) {
    console.error(" Error saving cart to DB:", error);
  }
}


