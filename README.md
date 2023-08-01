# ValidaThor ⚡️

Inspired by the likes of [Zod](https://github.com/colinhacks/zod) and [Valibot](https://github.com/fabian-hiller/valibot).

## Roadmap

This is a very short-term roadmap mind you and nothing here is final

- [x] ⚙️ Setup build system and package the library
- [ ] 📚 Add some basic documentation
- [ ] 🧬 Improve TypeScript types

## Example

```tsx
import { parse } from 'validathor';
import { object, string, number, boolean, date } from 'validathor/schemas';
import { min, max, minLength, maxLength, email } from 'validathor/modifiers';

// Define your schema shape
const exampleSchema = object({
  name: string([minLength(2)]),
  age: number([min(13), max(100)]),
  email: string([email()]),
  avatar: object({
    path: string(),
    size: number(),
  }),
  acceptedTerms: boolean()
  createdAt: date([
    minDate(new Date('2021/01/01')),
    maxDate(new Date()),
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
      avatar: {
        path: 'https://placekeanu.com/200/200',
        size: 2048
      },
      acceptedTerms: true,
      createdAt: new Date('01/08/2023')
    }
  );
} catch(err) {
  // Do something with the error
};
```


---

Made by [Kevin Østerkilde](https://oesterkilde.dk/?utm_campaign=validathor&utm_source=github&utm_medium=readme)