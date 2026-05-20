import { expect, test } from "vitest";
import { sum } from "../src/sum";

interface User {
  name: string;
  age: number;
}

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

function createUser(name: string, age: number): User {
  return { name, age };
}

test("creates a user with the correct fields", () => {
  const user = createUser("Alice", 30);

  expect(user).toEqual({ name: "Alice", age: 30 });
  expect(user.name).toBe("Alice");
});
