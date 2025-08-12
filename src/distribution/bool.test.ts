import Decimal from "decimal.js";
import { bool } from "./bool";
import { int32 } from "./int32";
import { integer } from "./integer";
import { uint53 } from "./uint53";

jest.mock("./int32");
jest.mock("./uint53");
jest.mock("./integer");

const zeroEngine = { next: () => 0 };
const oneEngine = { next: () => 1 }

const returnTwo = () => 2;
const returnThree = () => 3;

describe("bool distribution", () => {
  describe("when passed no arguments", () => {
    it("returns true if the least bit is 1", () => {
      const distribution = bool();

      const actual = distribution(oneEngine);

      expect(actual).toBe(true);
    });

    it("returns false if the least bit is 0", () => {
      const distribution = bool();

      const actual = distribution({ next: () => 2 });

      expect(actual).toBe(false);
    });
  });

  describe("when passed one argument", () => {
    describe.each([0, -1, -0.5])("when passed %p", (value) => {
      it("always returns false", () => {
        const distribution = bool(value);
        for (let i = 0; i < 10; ++i) {
          expect(distribution(undefined!)).toBe(false);
        }
      });
    });

    describe.each([1, 2, 1.5])("when passed %p", (value) => {
      it("always returns true", () => {
        const distribution = bool(value);
        for (let i = 0; i < 10; ++i) {
          expect(distribution(undefined!)).toBe(true);
        }
      });
    });

    describe("when passed a number that only requires 32 bits of randomness", () => {
      it(`returns false if int32 passes in a value >= percentage * 0x100000000`, () => {
        jest.resetAllMocks();
        const percentage = 0.125;
        (int32 as jest.Mock).mockReturnValue(
          Math.ceil(percentage * 0x100000000) - 0x80000000
        );
        const distribution = bool(percentage);

        const actual = distribution(zeroEngine);

        expect(actual).toBe(false);
      });

      it(`returns true if int32 passes in a value < percentage * 0x100000000`, () => {
        const percentage = 0.125;
        (int32 as jest.Mock).mockReturnValue(
          Math.ceil(percentage * 0x100000000) - 0x80000001
        );
        const distribution = bool(percentage);

        const actual = distribution(zeroEngine);

        expect(actual).toBe(true);
      });
    });

    describe("when passed a number that requires more than 32 bits of randomness", () => {
      it(`returns false if uint53 passes in a value >= percentage * 0x20000000000000`, () => {
        const percentage = new Decimal("0.1234567890123456789");
        const scale = new Decimal("0x20000000000000");

        (uint53 as jest.Mock).mockReturnValue(
          percentage.mul(scale).ceil().toNumber()
        );
        const distribution = bool(percentage.toNumber());

        const actual = distribution(zeroEngine);

        expect(actual).toBe(false);
      });

      it(`returns true if uint53 passes in a value < percentage * 0x20000000000000`, () => {
        const percentage = new Decimal("0.1234567890123456789");
        const scale = new Decimal("0x20000000000000");

        (uint53 as jest.Mock).mockReturnValue(
          percentage.mul(scale).floor().sub(1).toNumber()
        );
        const distribution = bool(percentage.toNumber());

        const actual = distribution(zeroEngine);

        expect(actual).toBe(true);
      });
    });
  });

  describe("when passed two arguments", () => {
    describe.each([0, -1])("when passed %p for the numerator", (numerator) => {
      it("always returns false", () => {
        const distribution = bool(numerator, 10);
        for (let i = 0; i < 10; ++i) {
          expect(distribution(undefined!)).toBe(false);
        }
      });
    });

    describe.each([0, 1])(
      "when passed a numerator that is the denominator + %p",
      (addition) => {
        it("always returns true", () => {
          const distribution = bool(10 + addition, 10);
          for (let i = 0; i < 10; ++i) {
            expect(distribution(undefined!)).toBe(true);
          }
        });
      }
    );

    it("uses the integer distribution and returns true if the numerator is < than the result", () => {
      const numerator = 3;
      const denominator = 10;
      (integer as jest.Mock).mockImplementation((min, max) => {
        expect(min).toBe(0);
        expect(max).toBe(denominator - 1);
        return returnTwo;
      });
      const distribution = bool(numerator, denominator);

      const actual = distribution(undefined!);

      expect(actual).toBe(true);
    });

    it("uses the integer distribution and returns false if the numerator is >= than the result", () => {
      const numerator = 3;
      const denominator = 10;
      (integer as jest.Mock).mockImplementation((min, max) => {
        expect(min).toBe(0);
        expect(max).toBe(denominator - 1);
        return returnThree;
      });
      const distribution = bool(numerator, denominator);

      const actual = distribution(undefined!);

      expect(actual).toBe(false);
    });
  });
});
