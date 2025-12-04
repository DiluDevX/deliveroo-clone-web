import { faker } from "@faker-js/faker";

export interface IDish {
  _id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: number;
}

export interface ICategory {
  data?: [string];
  id: number;
  name: string;
}

export interface IDishFake {
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
  categoryId: number;
}

export const specials: IDishFake[] = Array.from({ length: 25 }).map(
  (_, index) => ({
    id: index,
    image: faker.image.url(),
    name: faker.food.dish(),
    description: faker.food.description(),
    price: faker.commerce.price(),
    categoryId: faker.number.int({ max: 30, min: 0 }),
  }),
);

export const popular: IDishFake[] = Array.from({ length: 25 }).map(
  (_, index) => ({
    id: index,
    image: faker.image.url(),
    name: faker.food.dish(),
    description: faker.food.description(),
    price: faker.commerce.price(),
    categoryId: faker.number.int({ max: 30, min: 0 }),
  }),
);
