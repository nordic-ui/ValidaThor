<div align="center">
  <h1>ValidaThor <span role="presentation">⚡️</span></h1>
  <p>A simple validation library.</p>
</div>

<div align="center">
  <a href="https://validathor.oesterkilde.dk/?utm_campaign=validathor&utm_source=github&utm_medium=readme">Documentation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@nordic-ui/validathor">npm</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/Kosai106/ValidaThor/issues">Issues</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/Kosai106">@Kosai106</a>
  <br>
  <br>
</div>

## Overview

ValidaThor is a lightweight library that allows you to validate your data using a schema-based approach. With its intuitive API, you can easily create complex validation rules to ensure the quality of your input data.

### Features

- Define custom schema shapes using `object`, `string`, `number`, `boolean`, and `date` types
- Use modifiers (e.g., `min`, `max`, `email`, or even custom modifiers) to add constraints to your schema
- Validate input data against your defined schema

## Getting Started

To use ValidaThor in your project, simply install the library with your favourite package manager:

```sh
npm install @nordic-ui/validathor
yarn add @nordic-ui/validathor
pnpm add @nordic-ui/validathor
```

Then, import the library and start defining your schemas and modifiers!

### Example Usage

Here's a basic example of how you can use ValidaThor to validate some input data:

```ts
import {
  // Core
  parse,
  // Schemas
  object, string, number, boolean, date,
  // Modifiers
  min, max, minLength, maxLength, email,
} from '@nordic-ui/validathor';

// Define your schema shape
const exampleSchema = object({
  name: string([min(2)]),
  age: number([min(13), max(100)]),
  email: string([email()]),
  avatar: object({
    path: string(),
    size: number(),
  }),
  acceptedTerms: boolean(),
  createdAt: date([
    min(new Date('2021/01/01')),
    max(new Date()),
  ]),
});

// If the input data matches the schema, nothing will happen,
// Otherwise an error will be thrown to help the user
try {
  parse(
    exampleSchema,
    {
      name: 'John Doe',
      age: 35,
      email: 'email@example.com',
      avatar: { path: 'https://placekeanu.com/200/200', size: 2048 },
      acceptedTerms: true,
      createdAt: new Date('01/08/2023'),
    }
  );
} catch (err) {
  // Do something with the error
};
```

Visit the [documentation](https://validathor.oesterkilde.dk/?utm_campaign=validathor&utm_source=github&utm_medium=readme) for more insights into the available schemas and modifiers.

---

#### License

**ValidaThor** is licensed under the MIT license.

#### Author

Made by [Kevin Østerkilde](https://oesterkilde.dk/?utm_campaign=validathor&utm_source=github&utm_medium=readme)

#### Inspiration

- [Zod](https://github.com/colinhacks/zod)
- [Valibot](https://github.com/fabian-hiller/valibot).