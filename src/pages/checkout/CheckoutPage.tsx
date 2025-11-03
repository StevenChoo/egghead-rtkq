import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { useGetCheckoutQuery } from "../../store/apiSlice";

export function CheckoutPage() {
  const { checkoutId } = useParams<{ checkoutId: string }>();

  const { data, isLoading, error } = useGetCheckoutQuery(checkoutId || '', {
    skip: !checkoutId,
  });

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
