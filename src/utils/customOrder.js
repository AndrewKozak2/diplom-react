// Допоміжні функції для позицій кошика з кастомними моделями (body/wheel color),
// винесені для навчальної лабораторної роботи №1.

export function buildCustomCartItem(customModel) {
  return {
    id: `custom-${customModel.id}`,
    name: `${customModel.name} (Custom)`,
    price: customModel.price,
    quantity: 1,
    color: customModel.bodyColor,
    rimColor: customModel.rimColor,
  };
}

export function formatCustomOrderLabel(item) {
  return `${item.name} - Body: ${item.color}, Wheels: ${item.wheelColor}`;
}
