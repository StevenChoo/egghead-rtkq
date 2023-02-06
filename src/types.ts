export interface Dog {
  id: string;
  name: string;
  breed: string;
  weight: number;
  dob: string;
  size?: string;
  age?: number;
}

export interface DogInput {
  name: string;
  breed: string;
  weight: number;
  dob: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  restrictions: {
    minAge?: number;
    breed?: string[];
    size?: string[];
  };
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface DogsState {
  myDogs: Record<string, Dog>;
  luckyDog: string;
  dogsReady?: boolean;
}

export interface ServicesState {
  loading: boolean;
  hasServices: boolean;
  services: Service[];
}
