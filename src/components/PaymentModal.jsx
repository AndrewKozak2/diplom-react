import React from "react";
import { toast } from "react-hot-toast";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useTranslation } from "react-i18next";

function PaymentModal({ total, onClose, onOrderSuccess }) {
  const { t } = useTranslation();

  const handleSuccess = () => {
    toast.success(t("checkout.paypalSuccess"));
    onOrderSuccess();
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl text-center overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">{t("checkout.chooseMethod")}</h2>

        <PayPalScriptProvider options={{
          "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID
        }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  { amount: { value: total.toFixed(2) } }
                ]
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(() => {
                handleSuccess();
              });
            }}
            onCancel={() => toast(t("checkout.cancelled"))}
          />
        </PayPalScriptProvider>

        <p className="text-sm text-gray-500 mt-4">
          {t("checkout.paymentInfo")}
        </p>

        <button
          onClick={onClose}
          className="mt-6 text-sm text-gray-500 hover:underline block mx-auto"
        >
          {t("checkout.cancel")}
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;
