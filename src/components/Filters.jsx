import React from 'react';

function Filters({ brands, filters, onChange }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8 w-full max-w-sm border border-gray-200">
      <h2 className="font-semibold text-xl mb-4 text-gray-800">Filter by</h2>

      <label className="block mb-2 text-sm text-gray-600">Brand</label>
      <select
        className="w-full border rounded-md p-2 mb-6"
        value={filters.brand}
        onChange={(e) => onChange({ ...filters, brand: e.target.value })}
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <label className="block mb-2 text-sm text-gray-600">
        Max Price: <span className="font-medium text-gray-800">${filters.price}</span>
      </label>
      <input
        type="range"
        min="1"
        max="100"
        value={filters.price}
        className="w-full"
        onChange={(e) => onChange({ ...filters, price: Number(e.target.value) })}
      />
    </div>
  );
}

export default Filters;
