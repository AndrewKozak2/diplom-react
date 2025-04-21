import React from 'react';

function Filters({ brands, filters, onChange }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6 w-full max-w-xs">
      <h2 className="font-bold text-lg mb-4">Filters</h2>

      <label className="block mb-2">Brand:</label>
      <select
        className="w-full border rounded p-2 mb-4"
        value={filters.brand}
        onChange={(e) => onChange({ ...filters, brand: e.target.value })}
      >
        <option value="">All</option>
        {brands.map(brand => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>

      <label className="block mb-2">Scale:</label>
      <select
        className="w-full border rounded p-2 mb-4"
        value={filters.scale}
        onChange={(e) => onChange({ ...filters, scale: e.target.value })}
      >
        <option value="">All</option>
        <option value="1/64">1/64</option>
      </select>

      <label className="block mb-2">Max Price: ${filters.price}</label>
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
