import type { Service, Dog, DogInput, ContactForm } from "./types";

// services calls

export async function getServices(): Promise<Service[]> {
  return fetch("/api/services").then((response) => response.json());
}

// dog calls

export async function getDogs(): Promise<Record<string, Dog>> {
  return fetch("/api/dogs").then((response) => response.json());
}

export async function addDog(dog: DogInput): Promise<{ success: boolean }> {
  return fetch("/api/dogs", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dog),
  }).then((response) => response.json());
}

export async function deleteDog(id: string): Promise<{ id: string }> {
  return fetch("/api/dogs/" + id, {
    method: "delete",
  }).then((response) => response.json());
}

// other calls

export async function makeContact(data: ContactForm): Promise<ContactForm> {
  return fetch("/api/contact", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
}
