import { sample } from "./sample";
import { shuffle } from "./shuffle";

jest.mock("./shuffle");

const dummyEngine = { next: () => 0 };
const invalidSampleSizes = [-Infinity, Infinity, NaN, -1, 5];

invalidSampleSizes.forEach(sampleSize => {
  test(`throws a RangeError if sampleSize is ${sampleSize}`, () => {
    expect(() => {
      sample(dummyEngine, [], sampleSize);
    }).toThrow(
      new RangeError(
        "Expected sampleSize to be within 0 and the length of the population"
      )
    );
  });
});

test("calls shuffle on a clone of the array when sampleSize equals length", () => {
  const dummy: any[] = [];
  (shuffle as jest.Mock).mockReturnValue(dummy);
  const array = ["a", "b", "c"];

  const actual = sample(dummyEngine, array, array.length);

  expect(actual).toBe(dummy);
  expect(shuffle).toHaveBeenCalledWith(dummyEngine, array, 0);
  expect((shuffle as jest.Mock).mock.calls[0][1]).not.toBe(array);
});

test("calls shuffle on a clone of the array when sampleSize is less than length", () => {
  const dummy = ["e", "d", "c", "b", "a"];
  (shuffle as jest.Mock).mockReturnValue(dummy);
  const array = ["a", "b", "c", "d", "e"];
  const sampleSize = 3;
  const expected = dummy.slice(array.length - sampleSize);

  const actual = sample(dummyEngine, array, sampleSize);

  expect(actual).toEqual(expected);
  expect(shuffle).toHaveBeenCalledWith(
    dummyEngine,
    array,
    array.length - sampleSize - 1
  );
  expect((shuffle as jest.Mock).mock.calls[0][1]).not.toBe(array);
});

describe("when sampleSize is 0", () => {
  const array = ["a", "b", "c"];
  const sampleSize = 0;
  const engineMock = { next: jest.fn() };

  test("returns an empty array", () => {
    const expected: any[] = [];
    const actual = sample(dummyEngine, array, sampleSize);
    expect(actual).toEqual(expected);
  });

  test("does not call shuffle", () => {
    sample(dummyEngine, array, sampleSize);
    expect(shuffle).not.toHaveBeenCalled();
  });

  test("does not call the engine", () => {
    sample(engineMock, array, sampleSize);
    expect(engineMock.next).not.toHaveBeenCalled();
  });
});
