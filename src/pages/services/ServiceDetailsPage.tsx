import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { useGetServiceQuery } from "../../store/apiSlice";

export function ServiceDetailsPage() {
  const { serviceId } = useParams<{ serviceId: string }>();

  const { data: service, isLoading, error } = useGetServiceQuery(serviceId || '');

  if (isLoading) {
    return (
      <div className="page">
        <Loader />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="page">
        <h1>Service Not Found</h1>
        <p>The service you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{service.title}</h1>
      <img
        src={service.imageSrc}
        alt={service.imageAlt}
        style={{ maxWidth: "100%", borderRadius: "8px" }}
      />
      <h2>${service.price}</h2>
      <p>{service.description}</p>
      {service.restrictions && (
        <div>
          <h3>Restrictions</h3>
          <ul>
            {service.restrictions.minAge && (
              <li>Minimum age: {service.restrictions.minAge} years</li>
            )}
            {service.restrictions.breed && service.restrictions.breed.length > 0 && (
              <li>Breeds: {service.restrictions.breed.join(", ")}</li>
            )}
            {service.restrictions.size && service.restrictions.size.length > 0 && (
              <li>Sizes: {service.restrictions.size.join(", ")}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
