import React, { useEffect, useRef } from "react";

function PaypalCheckout({ amountUSD, onSuccess }) {
  const paypalRef1 = useRef();
  const paypalRef2 = useRef();

  useEffect(() => {
    if (!document.getElementById("paypal-sdk")) {
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=ATtVfeR1fm3349BTr427jYNq1bfFqpfvqwU-LGsMAu2St0vSJXkl5Vb70zRIFf0alJPtJa0zNaIW56-r&currency=USD&components=buttons,funding-eligibility";
      script.id = "paypal-sdk";
      script.onload = renderButtons;
      document.body.appendChild(script);
    } else {
      renderButtons();
    }

    function renderButtons() {
      if (!window.paypal) return;

      const baseStyle = {
        layout: "horizontal",
        color: "black",
        shape: "rect",
        label: "paypal",
        height: 45,
        tagline: false,
      };

      // PayPal button
      window.paypal
        .Buttons({
          style: baseStyle,
          fundingSource: window.paypal.FUNDING.PAYPAL,
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amountUSD.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            if (details.status === "COMPLETED") {
              onSuccess();
            }
          },
          onError: (err) => console.error("PayPal error:", err),
        })
        .render(paypalRef1.current);

      // Card button
      window.paypal
        .Buttons({
          style: baseStyle,
          fundingSource: window.paypal.FUNDING.CARD,
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amountUSD.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            if (details.status === "COMPLETED") {
              onSuccess();
            }
          },
          onError: (err) => console.error("Card error:", err),
        })
        .render(paypalRef2.current);
    }

    return () => {
      if (paypalRef1.current) paypalRef1.current.innerHTML = "";
      if (paypalRef2.current) paypalRef2.current.innerHTML = "";
    };
  }, [amountUSD, onSuccess]);

  return (
    <div className="flex justify-center gap-4 flex-wrap mt-4 w-full max-w-[700px] mx-auto min-h-[120px]">
<div ref={paypalRef1} className="w-full sm:w-[48%] min-w-[300px]" />
<div ref={paypalRef2} className="w-full sm:w-[48%] min-w-[300px]" />

    </div>
  );
}

export default PaypalCheckout;
