import React from 'react';

function Filters({ brands, filters, onChange }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md sm:shadow-lg mb-6 sm:mb-8 w-full border border-gray-200 max-w-full sm:max-w-sm sm:mx-0 mx-4">
      <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-800">Filter by</h2>
      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-600">Brand</label>
        <select
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
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
      </div>

      <div>
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
    </div>
  );
}

export default Filters;
