import { rest } from "msw";
import services from "./services.json";

const DOG_KEY = "dogs";
const CHECKOUT_KEY = "checkouts";

// Type the services object to allow string indexing
const servicesMap: Record<string, any> = services as any;

const getDogs = () => JSON.parse(sessionStorage.getItem(DOG_KEY) || "{}");
const getCheckouts = () => JSON.parse(sessionStorage.getItem(CHECKOUT_KEY) || "{}");

const setDogs = (dogs: any) => {
  sessionStorage.setItem(DOG_KEY, JSON.stringify(dogs));
};

const setCheckouts = (checkouts: any) => {
  sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkouts));
};

export const handlers = [
  // submit the contact form
  rest.post("/api/contact", (req, res, ctx) => {
    const data = req.json();
    return res(ctx.delay(), ctx.json(data));
  }),

  // get the list of all of the services
  rest.get("/api/services", (_req, res, ctx) => {
    return res(ctx.delay(), ctx.json(Object.values(servicesMap)));
  }),

  // get detail for a specific service
  rest.get("/api/services/:id", (req, res, ctx) => {
    const { id } = req.params;
    const service = servicesMap[id as string];
    if (service) {
      return res(ctx.delay(), ctx.json(service));
    } else {
      return res(
        ctx.status(404),
        ctx.json({ message: "The service was not found within our mock data." })
      );
    }
  }),

  // get all of your dogs
  rest.get("/api/dogs", (_req, res, ctx) => {
    return res(ctx.delay(), ctx.json(getDogs()));
  }),

  // add a dog
  rest.post("/api/dogs", async (req, res, ctx) => {
    // return res(ctx.status(500), ctx.json({ message: "Too many dogs" }));
    const data = await req.json();
    const id = crypto.randomUUID();
    data.id = id;

    // mutate
    const dogs = getDogs();
    dogs[id] = data;

    // then save
    setDogs(dogs);

    return res(ctx.delay(), ctx.json({ success: true }));
  }),

  rest.delete("/api/dogs/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const idStr = id as string;
    const dogs = getDogs();
    if (idStr in dogs) {
      // delete
      delete dogs[idStr];

      // then save
      setDogs(dogs);

      // then return whategver happens
      return res(ctx.delay(2500), ctx.json({ id: idStr }));
    } else {
      return res(
        ctx.delay(),
        ctx.status(404),
        ctx.json({ message: "what dog?" })
      );
    }
  }),

  // create a checkout
  rest.post("/api/checkout", async (req, res, ctx) => {
    const data = await req.json();
    const { dogId, serviceIds } = data;

    const dogs = getDogs();
    const dog = dogs[dogId];
    if (!dog) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Dog not found" })
      );
    }

    const selectedServices = serviceIds
      .map((serviceId: string) => servicesMap[serviceId])
      .filter(Boolean)
      .map((service: any) => ({
        id: service.id,
        title: service.title,
        price: service.price,
      }));

    const totalPrice = selectedServices.reduce(
      (sum: number, service: any) => sum + service.price,
      0
    );

    const checkoutId = crypto.randomUUID();
    const checkout = {
      id: checkoutId,
      dogId,
      dogName: dog.name,
      services: selectedServices,
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    const checkouts = getCheckouts();
    checkouts[checkoutId] = checkout;
    setCheckouts(checkouts);

    return res(ctx.delay(), ctx.json(checkout));
  }),

  // get a checkout by id
  rest.get("/api/checkout/:id", (req, res, ctx) => {
    const { id } = req.params;
    const idStr = id as string;
    const checkouts = getCheckouts();
    const checkout = checkouts[idStr];

    if (checkout) {
      return res(ctx.delay(), ctx.json(checkout));
    } else {
      return res(
        ctx.status(404),
        ctx.json({ message: "Checkout not found" })
      );
    }
  }),
];
