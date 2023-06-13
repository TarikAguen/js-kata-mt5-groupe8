// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import fc from "fast-check";
import { rpn } from "./index";

expect.extend(matchers);

test("A simple test (Jest)", () => {
  expect(1 + 1).toEqual(2);
});

test("Additional matchers (jest-extended)", () => {
  expect([1, 0]).toIncludeSameMembers([0, 1]);
});

test("Property-based testing (fast-check)", () => {
  type Boundaries = {
    min: number;
    max: number;
  };

  const minmax =
    ({ min, max }: Boundaries) =>
    (n: number): number =>
      Math.min(max, Math.max(min, n));

  fc.assert(
    fc.property(fc.integer(), (n): boolean => {
      const result = minmax({ min: 1, max: 10 })(n);
      return 1 <= result && result <= 10;
    })
  );
});

test("RPN basic operations", () => {
  expect(rpn("3 4 +")).toEqual(7); // Addition
  expect(rpn("5 3 -")).toEqual(2); // Soustraction
  expect(rpn("2 3 *")).toEqual(6); // Multiplication
  expect(rpn("8 4 /")).toEqual(2); // Division
  expect(rpn("10 3 MOD")).toEqual(1); // Modulo
  expect(rpn("2 3 4 + *")).toEqual(14); // Combinaison de plusieurs opérations
  expect(rpn("3 4 - NEGATE")).toEqual(1); // Opération unaire NEGATE
});

test("RPN invalid expressions", () => {
  expect(() => rpn("3 4")).toThrow("Invalid RPN expression");
  expect(() => rpn("3 4 + +")).toThrow("Invalid RPN expression");
});

test("Property-based testing for NEGATE operator (fast-check)", () => {
  fc.assert(
    fc.property(fc.integer(), (n: number): boolean => {
      const result = rpn(`${n} NEGATE`);
      return result === -n;
    })
  );
});
