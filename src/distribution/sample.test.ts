import { sample } from "./sample";
import { shuffle } from "./shuffle";

jest.mock("./shuffle");

const zeroEngine = { next: () => 0 };

describe("sample", () => {
  const errorSampleSizes = [-Infinity, Infinity, NaN, -1, 5];

  describe.each(errorSampleSizes)("throws RangeError for sampleSize: %p", (sampleSize) => {
    it("throws a RangeError", () => {
      expect(() => {
        sample(zeroEngine, [], sampleSize);
      }).toThrow(
        new RangeError(
          "Expected sampleSize to be within 0 and the length of the population"
        )
      );
    });
  });

  describe("when sampleSize is the same as length", () => {
    it("calls shuffle on a clone of the array", () => {
      const dummy: any[] = [];
      (shuffle as jest.Mock).mockReturnValue(dummy);
      const array = ["a", "b", "c"];

      const actual = sample(zeroEngine, array, array.length);

      expect(actual).toBe(dummy);
      expect(shuffle).toHaveBeenCalledWith(zeroEngine, array, 0);
      expect((shuffle as jest.Mock).mock.calls[0][1]).not.toBe(array);
    });
  });

  describe("when sampleSize is less than the length", () => {
    it("calls shuffle on a clone of the array", () => {
      const dummy = ["e", "d", "c", "b", "a"];
      (shuffle as jest.Mock).mockReturnValue(dummy);
      const array = ["a", "b", "c", "d", "e"];
      const sampleSize = 3;
      const expected = dummy.slice(array.length - sampleSize);

      const actual = sample(zeroEngine, array, sampleSize);

      expect(actual).toEqual(expected);
      expect(shuffle).toHaveBeenCalledWith(
        zeroEngine,
        array,
        array.length - sampleSize - 1
      );
      expect((shuffle as jest.Mock).mock.calls[0][1]).not.toBe(array);
    });
  });

  describe("when sampleSize is 0", () => {
    it("returns an empty array", () => {
      const array = ["a", "b", "c"];
      const expected: any[] = [];
      const sampleSize = 0;

      const actual = sample(zeroEngine, array, sampleSize);

      expect(actual).toEqual(expected);
    });

    it("does not call shuffle", () => {
      const array = ["a", "b", "c"];
      const sampleSize = 0;

      sample(zeroEngine, array, sampleSize);

      expect(shuffle).not.toHaveBeenCalled();
    });

    it("does not call the engine", () => {
      const engine = { next: jest.fn() };

      sample(engine, ["a", "b", "c"], 0);

      expect(engine.next).not.toHaveBeenCalled();
    });
  });
});
