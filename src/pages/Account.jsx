import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Account() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState({
    username: "",
    email: "",
    city: "",
    warehouse: "",
    phone: "",
  });
  const [initialUser, setInitialUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [cityRef, setCityRef] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showConfirm]);

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
    if (name === "city") fetchCities(value);
  };

  const handleCitySelect = (city) => {
    setUser((prev) => ({ ...prev, city: city.Description, warehouse: "" }));
    setCities([]);
    setCityRef(city.Ref);
  };

  const handleWarehouseFocus = () => {
    if (cityRef) fetchWarehouses(cityRef);
  };

  const handleWarehouseInput = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, warehouse: value }));
    if (cityRef) fetchWarehouses(cityRef, value);
  };

  const handleSaveClick = () => {
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    setShowConfirm(false);
    const token = localStorage.getItem("token");
    if (!token) return;

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

      if (initialUser.email !== updatedProfile.email) {
        localStorage.clear();
        window.dispatchEvent(new Event("cartUpdated"));
        setSuccessMessage("Email updated! Please login again.");
        setTimeout(() => navigate("/login"), 1500);
      } else if (initialUser.username !== updatedProfile.username) {
        setSuccessMessage("Username updated!");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
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
        {t("account.loading")}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-bold text-center mb-2">{t("account.title")}</h1>
      <p className="text-center text-gray-600 mb-8">{t("account.subtitle")}</p>

      {successMessage && (
        <div className="mb-4 text-green-600 text-center font-medium">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 text-red-600 text-center font-medium">
          {errorMessage}
        </div>
      )}

      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder={t("account.username")}
            autoComplete="off"
            value={user.username || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="email"
            name="email"
            placeholder={t("account.email")}
            autoComplete="off"
            value={user.email || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="city"
              placeholder={t("account.city")}
              autoComplete="off"
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

          <div className="relative">
            <input
              type="text"
              name="warehouse"
              placeholder={t("account.warehouse")}
              autoComplete="off"
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
                        setUser((prev) => ({
                          ...prev,
                          warehouse: wh.Description,
                        }));
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

          <input
            type="text"
            name="phone"
            placeholder={t("account.phone")}
            autoComplete="off"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
        >
          {t("account.logout")}
        </button>
        <button
          onClick={handleSaveClick}
          disabled={!hasChanges}
          className={`px-6 py-2 font-semibold rounded-md transition ${
            hasChanges
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {t("account.save")}
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md text-center">
            <h3 className="text-lg font-semibold mb-4">
              {t("account.confirmTitle")}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {t("account.confirmText")}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmSave}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium"
              >
                {t("account.confirm")}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
              >
                {t("account.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
