import React from 'react';

function ProductCard({ model, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 flex flex-col items-center">
      <img
        src={model.image}
        alt={model.name}
        onError={(e) => (e.target.src = '/images/placeholder.svg')}
        className="w-full h-48 object-contain rounded mb-4 bg-gray-50"
      />
      <h3 className="text-center text-lg font-semibold text-gray-900 mb-1">{model.name}</h3>
      <p className="text-sm text-gray-500 mb-1">Scale: {model.scale}</p>
      <p className="text-blue-600 text-base font-bold mb-4">${model.price}</p>
      <button
        onClick={() => onAddToCart(model)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
