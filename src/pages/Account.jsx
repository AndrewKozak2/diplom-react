import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", city: "", warehouse: "", phone: "" });
  const [initialUser, setInitialUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [cityRef, setCityRef] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:3000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data);
        setInitialUser(data);

        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);

        window.dispatchEvent(new Event("profileUpdated"));
      } catch (error) {
        console.error("Error loading profile:", error);
        setErrorMessage("Failed to load profile.");
        setTimeout(() => setErrorMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".city-autocomplete") &&
        !e.target.closest("input[name='city']")
      ) {
        setCities([]);
      }
      if (
        !e.target.closest(".warehouse-autocomplete") &&
        !e.target.closest("input[name='warehouse']")
      ) {
        setWarehouses([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchCities = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setCities([]);
      return;
    }
    try {
      const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "52a4484ea02a26983e729db187fc04fc",
          modelName: "Address",
          calledMethod: "getCities",
          methodProperties: { FindByString: searchTerm },
        }),
      });
      const data = await response.json();
      if (data.success) setCities(data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchWarehouses = async (cityRef, searchTerm = "") => {
    try {
      const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "52a4484ea02a26983e729db187fc04fc",
          modelName: "Address",
          calledMethod: "getWarehouses",
          methodProperties: { CityRef: cityRef, FindByString: searchTerm },
        }),
      });
      const data = await response.json();
      if (data.success) setWarehouses(data.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    if (name === "city") {
      fetchCities(value);
    }
  };

  const handleCitySelect = (city) => {
    setUser((prev) => ({ ...prev, city: city.Description, warehouse: "" }));
    setCities([]);
    setCityRef(city.Ref);
  };

  const handleWarehouseFocus = () => {
    if (cityRef) {
      fetchWarehouses(cityRef);
    }
  };

  const handleWarehouseInput = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, warehouse: value }));

    if (cityRef) {
      fetchWarehouses(cityRef, value);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmUpdate = window.confirm("Are you sure you want to save changes?");
    if (!confirmUpdate) return;

    try {
      const res = await fetch("http://localhost:3000/api/user/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedProfile = await res.json();
      setUser(updatedProfile);
      setInitialUser(updatedProfile);

      localStorage.setItem("username", updatedProfile.username);
      localStorage.setItem("email", updatedProfile.email);
      window.dispatchEvent(new Event("profileUpdated"));

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/");
  };

  const hasChanges =
    initialUser &&
    Object.keys(initialUser).some((key) => user[key] !== initialUser[key]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600 text-lg mt-24">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-24">
      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="nope"
            value={user.username || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="nope"
            value={user.email || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <div className="space-y-4">
          {/* City */}
          <div className="relative">
            <input
              type="text"
              name="city"
              placeholder="City"
              autoComplete="nope"
              value={user.city}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
            {cities.length > 0 && (
              <div className="city-autocomplete absolute top-full left-0 right-0 bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg z-10">
                {cities.map((city) => (
                  <div
                    key={city.Ref}
                    onClick={() => handleCitySelect(city)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {city.Description}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warehouse */}
          <div className="relative">
            <input
              type="text"
              name="warehouse"
              placeholder="Warehouse"
              autoComplete="nope"
              value={user.warehouse}
              onFocus={handleWarehouseFocus}
              onChange={handleWarehouseInput}
              className="w-full border rounded-md p-2"
            />
            {warehouses.length > 0 && (
              <div className="warehouse-autocomplete absolute top-full left-0 right-0 bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg z-10">
                {warehouses
                  .filter((wh) => {
                    if (user.warehouse.trim() === "") return true;
                    const search = user.warehouse.trim();
                    const regex = new RegExp(`№\\s*${search}`, "i");
                    return regex.test(wh.Description);
                  })
                  .map((wh) => (
                    <div
                      key={wh.Ref}
                      onClick={() => {
                        setUser((prev) => ({ ...prev, warehouse: wh.Description }));
                        setWarehouses([]);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {wh.Description}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
        >
          Log Out
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-6 py-2 font-semibold rounded-md transition ${
            hasChanges
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Account;
