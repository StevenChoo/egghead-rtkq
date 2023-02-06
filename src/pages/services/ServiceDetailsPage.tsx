import { useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { Loader } from "../../components/Loader";
import { fetchServiceById, selectServiceById } from "./servicesSlice";

export function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const service = useSelector((state: RootState) =>
    serviceId ? selectServiceById(state, serviceId) : undefined
  );
  const isLoading = useSelector((state: RootState) => state.services.loading);
  const error = useSelector((state: RootState) => state.services.error);

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchServiceById(serviceId));
    }
  }, [dispatch, serviceId]);

  return (
    <div className="page">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <>
          <h1>Could not find service: {serviceId}</h1>
          <p className="error">{error}</p>
        </>
      ) : null}
      {service ? (
        <>
          <h1>{service.title} Service</h1>
          <div className="card">
            <img src={service.imageSrc} alt={service.imageAlt} />
            <div className="cardContents">
              <h3>${service.price}</h3>
              <p>{service.description}</p>
              <div className="restrictions">
                <h3>Restrictions:</h3>
                <dl>
                  {Object.entries(service.restrictions).map(
                    ([key, details]) => (
                      <>
                        <dt>{key}:</dt>
                        <dd>
                          {Array.isArray(details)
                            ? details.join(", ")
                            : details}
                        </dd>
                      </>
                    )
                  )}
                </dl>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
