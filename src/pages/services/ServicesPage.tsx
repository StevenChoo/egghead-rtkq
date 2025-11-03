import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Link, useNavigate } from "react-router-dom";
import { LuckyDog } from "../dogs/LuckyDog";
import { Loader } from "../../components/Loader";
import {
  useGetServicesQuery,
  useGetDogsQuery,
  useCreateCheckoutMutation,
} from "../../store/apiSlice";
import { addToCart, clearCart } from "../checkout/cartSlice";
import { selectLuckyDogId } from "../dogs/uiSlice";

export function ServicesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const luckyDogId = useSelector(selectLuckyDogId);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const { data: servicesData = [], isLoading: isLoadingServices } = useGetServicesQuery();
  const { data: dogsData = {}, isLoading: isLoadingDogs } = useGetDogsQuery();
  const [createCheckout, { isLoading: isCheckingOut }] = useCreateCheckoutMutation();

  // Data already transformed by transformResponse in API slice
  const myDogs = Object.values(dogsData);

  const luckyDog = luckyDogId ? myDogs.find(d => d.id === luckyDogId) : null;

  // Filter services based on the lucky dog's attributes
  const myServices = useMemo(() => {
    if (!luckyDog) return servicesData;

    return servicesData.filter((service) => {
      const { restrictions } = service;

      // Check age restriction
      if (restrictions.minAge && (luckyDog.age ?? 0) < restrictions.minAge) {
        return false;
      }

      // Check breed restriction
      if (restrictions.breed && !restrictions.breed.includes(luckyDog.breed)) {
        return false;
      }

      // Check size restriction
      if (restrictions.size && !restrictions.size.includes(luckyDog.size ?? '')) {
        return false;
      }

      return true;
    });
  }, [luckyDog, servicesData]);

  const handleAddToCart = (service: any) => {
    dispatch(
      addToCart({
        serviceId: service.id,
        title: service.title,
        price: service.price,
      })
    );
  };

  const handleCheckout = async () => {
    if (!luckyDogId || cartItems.length === 0) {
      return;
    }

    try {
      const result = await createCheckout({
        dogId: luckyDogId,
        serviceIds: cartItems.map((item) => item.serviceId),
      }).unwrap();

      // Clear cart after successful checkout
      dispatch(clearCart());

      // Navigate to checkout page
      navigate(`/checkout/${result.id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const isServiceInCart = (serviceId: string) => {
    return cartItems.some((item) => item.serviceId === serviceId);
  };

  return (
    <div className="page">
      <h1>Services</h1>
      {cartItems.length > 0 && (
        <div className="cartSummary">
          <p>
            Cart: {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </p>
          {luckyDog && (
            <button
              className="btn checkoutBtn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
          )}
        </div>
      )}
      {isLoadingServices || isLoadingDogs ? (
        <>
          <Loader />
          <Loader />
          <Loader />
        </>
      ) : (
        <>
          {myDogs.length === 0 ? (
            <p>
              We are currently showing all {servicesData.length} of our services.
              <br />
              To see a customized list please <Link to="/dogs">add a dog</Link>.
            </p>
          ) : luckyDog ? (
            myServices.length > 0 ? (
              <>
                <p>
                  Showing{" "}
                  <b>
                    {myServices.length}/{servicesData.length}
                  </b>{" "}
                  services available for <b>{luckyDog.name}</b>
                </p>
                <LuckyDog />
              </>
            ) : (
              <>
                <p>
                  Unfortunately, <b>{luckyDog.name}</b> doesn&apos;t
                  qualify for any of our services. Guess they&apos;re not such a
                  lucky dog after all. Please select another dog if you have
                  one.
                </p>
                <LuckyDog />
              </>
            )
          ) : (
            <>
              <p>
                We are currently showing all {servicesData.length} of our services.
              </p>
              <p>To see a customized list please select a lucky dog below.</p>
              <LuckyDog />
            </>
          )}
          {myServices.map((service) => (
            <div className="card" key={service.id}>
              <Link to={`/services/${service.id}`}>
                <img src={service.imageSrc} alt={service.imageAlt} />
              </Link>
              <div className="cardContents">
                <h3>{service.title}</h3>
                <h4>${service.price}</h4>
                <p>{service.description}</p>
                {isServiceInCart(service.id) ? (
                  <button className="btn" disabled>
                    In Cart
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={() => handleAddToCart(service)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
