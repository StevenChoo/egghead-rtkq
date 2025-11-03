import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";

interface CheckoutData {
  dogName: string;
  services: Array<{ id: string; title: string; price: number }>;
  totalPrice: number;
  createdAt: string;
}

export function CheckoutPage() {
  const { checkoutId } = useParams<{ checkoutId: string }>();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckout = async () => {
      if (!checkoutId) {
        setError("No checkout ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/checkout/${checkoutId}`);

        if (!response.ok) {
          throw new Error("Checkout not found");
        }

        const checkoutData = await response.json();
        setData(checkoutData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckout();
  }, [checkoutId]);

  if (isLoading) {
    return (
      <div className="page">
        <h1>Checkout</h1>
        <Loader />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page">
        <h1>Checkout</h1>
        <p>Checkout not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Checkout Successful!</h1>

      <div className="checkoutSummary">
        <h2>Order Summary</h2>

        <div className="checkoutDog">
          <h3>Dog</h3>
          <p>
            <strong>{data.dogName}</strong>
          </p>
        </div>

        <div className="checkoutServices">
          <h3>Services</h3>
          {data.services.map((service) => (
            <div key={service.id} className="checkoutServiceItem">
              <span>{service.title}</span>
              <span>${Number(service.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="checkoutTotal">
          <h3>Total</h3>
          <p className="totalPrice">${Number(data.totalPrice).toFixed(2)}</p>
        </div>

        <p className="checkoutDate">
          Order placed: {new Date(data.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
