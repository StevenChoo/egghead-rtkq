import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import { Link, useNavigate } from "react-router-dom";
import { LuckyDog } from "../dogs/LuckyDog";
import { Loader } from "../../components/Loader";
import {
  fetchServices,
  selectAllServices,
  selectServicesLoading,
  selectServicesForLuckyDog
} from "./servicesSlice";
import {
  fetchDogs,
  selectAllDogs,
  selectDogsLoading,
  selectLuckyDog,
  selectLuckyDogEntity
} from "../dogs/dogsSlice";
import { addToCart, submitCheckout } from "../checkout/cartSlice";
import type { RootState } from "../../store";

export function ServicesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const services = useSelector(selectAllServices);
  const myDogs = useSelector(selectAllDogs);
  const luckyDog = useSelector(selectLuckyDog);
  const luckyDogEntity = useSelector(selectLuckyDogEntity);
  const myServices = useSelector(selectServicesForLuckyDog);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const checkoutLoading = useSelector((state: RootState) => state.cart.checkoutLoading);

  const isLoadingServices = useSelector(selectServicesLoading);
  const isLoadingDogs = useSelector(selectDogsLoading);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchDogs());
  }, [dispatch]);

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
    if (!luckyDog) return;

    const serviceIds = cartItems.map((item) => item.serviceId);
    console.log('Checkout - Cart items:', cartItems);
    console.log('Checkout - Service IDs:', serviceIds);
    const result = await dispatch(submitCheckout({ dogId: luckyDog, serviceIds }));

    if (submitCheckout.fulfilled.match(result)) {
      console.log('Checkout result:', result.payload);
      const checkoutId = result.payload.id;
      navigate(`/checkout/${checkoutId}`);
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
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Processing..." : "Checkout"}
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
              We are currently showing all {services.length} of our services.
              <br />
              To see a customized list please <Link to="/dogs">add a dog</Link>.
            </p>
          ) : luckyDogEntity ? (
            myServices.length > 0 ? (
              <>
                <p>
                  Showing{" "}
                  <b>
                    {myServices.length}/{services.length}
                  </b>{" "}
                  services available for <b>{luckyDogEntity.name}</b>
                </p>
                <LuckyDog />
              </>
            ) : (
              <>
                <p>
                  Unfortunately, <b>{luckyDogEntity.name}</b> doesn&apos;t
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
                We are currently showing all {services.length} of our services.
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
