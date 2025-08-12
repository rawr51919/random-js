import { XorGen4096 } from "./xorgen4096";

describe("engines.XorGen4096", () => {
  it("produces consistent output after seeding with a number", () => {
    const seed = 12345;
    const engine = XorGen4096.seed(seed);

    // Generate a few values
    const values = Array.from({ length: 10 }, () => engine.next());

    // Reseed with the same seed and verify output matches
    const engine2 = XorGen4096.seed(seed);
    const values2 = Array.from({ length: 10 }, () => engine2.next());

    expect(values2).toEqual(values);
  });

  it("produces consistent output after seeding with an array", () => {
    const seedArray = [1, 2, 3, 4, 5];
    const engine = XorGen4096.seedWithArray(seedArray);

    const values = Array.from({ length: 10 }, () => engine.next());

    const engine2 = XorGen4096.seedWithArray(seedArray);
    const values2 = Array.from({ length: 10 }, () => engine2.next());

    expect(values2).toEqual(values);
  });

  it("autoSeed produces different outputs on different instances", () => {
    const engine1 = XorGen4096.autoSeed();
    const engine2 = XorGen4096.autoSeed();

    const val1 = engine1.next();
    const val2 = engine2.next();

    // They might collide rarely, but test they are usually different
    expect(val1).not.toBe(val2);
  });

  it("discards the correct number of values", () => {
    const engine = XorGen4096.seed(1);
    engine.next();
    engine.next();

    const before = engine.getUseCount();

    engine.discard(5);

    expect(engine.getUseCount()).toBe(before + 5);

    // The next value should be consistent with skipping 7 values total
    const engine2 = XorGen4096.seed(1);
    for (let i = 0; i < 7; i++) engine2.next();

    expect(engine.next()).toBe(engine2.next());
  });

  it("getUseCount returns the number of times next was called", () => {
    const engine = XorGen4096.seed(42);

    expect(engine.getUseCount()).toBe(0);

    engine.next();
    engine.next();
    engine.next();

    expect(engine.getUseCount()).toBe(3);
  });

  it("returns 32-bit signed integers on next()", () => {
    const engine = XorGen4096.seed(98765);
    for (let i = 0; i < 100; i++) {
      const val = engine.next();
      expect(Number.isInteger(val)).toBe(true);
      // Check 32-bit signed integer range
      expect(val).toBeGreaterThanOrEqual(-2147483648);
      expect(val).toBeLessThanOrEqual(2147483647);
    }
  });
});
