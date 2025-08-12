# Creating a New RNG Engine in `random-js`

## Overview

Each RNG (Random Number Generator) engine in `random-js` is implemented as a standalone module located in the `src/engine/` directory. This file contains the engine’s logic, configuration parameters, constructor arguments, and all necessary methods for generating random values compatible with the `random-js` ecosystem.

Adding a new RNG engine allows you to customize how random numbers are generated, whether for performance improvements, cryptographic security, or experimental algorithms.

---

## File Structure and Naming

- Create a new file in the `src/engine/` directory for your engine, named appropriately, e.g., `myEngine.ts`.
- Follow the naming conventions and coding style consistent with existing engines in this folder.
- Your engine module should export the engine as a **named export**.

---

## Implementation Requirements

Your RNG engine module must include:

- A **class or function** that implements the RNG engine.
- A **constructor or initialization function** that accepts parameters such as seeds or options needed to configure the engine.
- A core method (commonly `next()`) that returns a random number, usually a floating-point number in the range `[0, 1]`.

### Example Skeleton (Class-based):

```ts
export class myEngine {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
    // Initialize internal state here
  }

  next(): number {
    // Return a pseudo-random number between 0 (inclusive) and 1 (exclusive)
    return Math.random(); // Replace with your algorithm
  }
}
```

### Example Skeleton (Function-based):

```ts
export function myEngine(seed: number) {
  // Initialization code

  return {
    next: () => {
      return Math.random(); // Replace with your algorithm
    }
  };
}
```

---

## Exporting and Importing

- Export your engine as a named export in your engine file, e.g.,

```ts
export class myEngine { /* ... */ }
```

or

```ts
export function myEngine(seed: number) { /* ... */ }
```

- Your engine can then be imported elsewhere using:

```ts
import { myEngine } from 'myEngine';
```

This import statement assumes that the build or module resolution system maps `'myEngine'` to the `src/engine/myEngine.ts` file.

---

## Parameters and Configuration

Clearly document any constructor or function parameters your engine uses:

- **Seed:** Typically a number or array to initialize the RNG state.
- **Options:** Any additional configuration parameters like state size, algorithm variants, etc.

Specify accepted types, value ranges, and default values.

---

## Integration

- After implementing your engine, ensure it is integrated into the package’s engine registry or usage points so it can be instantiated by the random-js API.
- Test the integration with example code to confirm it works as expected.

---

## Adding Tests for Your Engine

Testing is essential to ensure your RNG engine behaves correctly, is reproducible with seeds, and produces values within expected ranges.

### Location of Tests

- Place your test file **in the same folder as your engine**, i.e., alongside `src/engine/myEngine.ts`.
- Use a naming convention like `myEngine.test.ts` or `myEngine.spec.ts`.

### What to Test

- **Seed reproducibility:** Confirm that using the same seed produces the same sequence of outputs.
- **Output range:** Verify all generated values are within the expected range (usually `[0, 1)`).
- **Output distribution (optional):** Basic statistical checks or randomness properties.
- **Error handling:** Confirm your engine handles invalid or edge-case inputs gracefully.

### Example Test Snippet

```ts
import { myEngine } from './myEngine';

describe('myEngine', () => {
  test('produces reproducible output for the same seed', () => {
    const seed = 12345;
    const engine1 = new myEngine(seed);
    const engine2 = new myEngine(seed);

    expect(engine1.next()).toBe(engine2.next());
    expect(engine1.next()).toBe(engine2.next());
  });

  test('produces numbers in [0, 1)', () => {
    const engine = new myEngine(6789);
    for (let i = 0; i < 1000; i++) {
      const val = engine.next();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
});
```

### Running Tests

- Run tests using the standard project test commands (e.g., `npm test` or `yarn test`).
- Ensure your new tests pass before submitting changes.

---

## Example Usage

```ts
import { myEngine } from 'myEngine';

const engine = new myEngine(12345);
const randomValue = engine.next();
console.log(randomValue); // Outputs a number between 0 and 1
```

---

## Reference Existing Engines

For concrete examples, review existing engines in `src/engine/` such as `MersenneTwister19937.ts` or `nativeMath.ts`. These examples demonstrate handling of state, seeding, and producing random values compatible with the `random-js` system, as well as their corresponding tests.

---
