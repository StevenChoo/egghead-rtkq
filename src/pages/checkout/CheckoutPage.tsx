import { Loader } from "../../components/Loader";

interface CheckoutData {
  dogName: string;
  services: Array<{ id: string; title: string; price: string }>;
  totalPrice: string;
  createdAt: string;
}

export function CheckoutPage() {
  // For main branch: hooks won't work, so just show UI structure
  // This will be implemented properly in RTK Query branches
  const data: CheckoutData | null = null;
  const isLoading = false;
  const error = null;

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
        <p className="note">
          Note: Checkout functionality is not implemented in the main branch.
          Please check the RTK Query branches for working implementation.
        </p>
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
            <strong>{(data as CheckoutData).dogName}</strong>
          </p>
        </div>

        <div className="checkoutServices">
          <h3>Services</h3>
          {(data as CheckoutData).services.map((service: any) => (
            <div key={service.id} className="checkoutServiceItem">
              <span>{service.title}</span>
              <span>${Number(service.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="checkoutTotal">
          <h3>Total</h3>
          <p className="totalPrice">${Number((data as CheckoutData).totalPrice).toFixed(2)}</p>
        </div>

        <p className="checkoutDate">
          Order placed: {new Date((data as CheckoutData).createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
