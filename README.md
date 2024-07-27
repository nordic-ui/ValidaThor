# ValidaThor ⚡️

⚠️ This library is still under active development ⚠️

Inspired by the likes of [Zod](https://github.com/colinhacks/zod) and [Valibot](https://github.com/fabian-hiller/valibot).

## Roadmap

This is a very short-term roadmap mind you and nothing here is final

- [x] ⚙️ Setup build system and package the library
- [x] 📚 Add some basic documentation
- [ ] 🧬 Improve TypeScript types

## Example

```tsx
import * as v from '@nordic-ui/validathor';

// Define your schema shape
const exampleSchema = v.object({
  name: v.string([v.min(2)]),
  age: v.number([v.min(13), v.max(100)]),
  email: v.string([v.email()]),
  avatar: v.object({
    path: v.string(),
    size: v.number(),
  }),
  acceptedTerms: v.boolean(),
  createdAt: v.date([
    v.min(new Date('2021/01/01')),
    v.max(new Date()),
  ]),
});

// If the input data matches the schema, nothing will happen,
// Otherwise an error will be thrown to help the user
try {
  v.parse(
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