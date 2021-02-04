This is a [Express.js](https://expressjs.com/) / [Typescript](https://www.typescriptlang.org/) project bootstrapped with [`express-generator-typescript`](https://github.com/seanpmaxwell/express-generator-typescript).
We are also using [GraphQL](https://graphql.org/) as a query language.

## Getting Started

First, run the development server:

```bash
yarn start:dev
```

Open [http://localhost:5000/graphql](http://localhost:5000/graphql) with your browser to see the result.

- First start by setting up your env variables inside `env/` directory.

- Main server and database configuration are located inside `src/Server.ts` file.

- We are using [TypeORM](https://typeorm.io/#/) for the Object–relational mapping. Inside entities we are using [class-validator](https://github.com/typestack/class-validator) to validate entities.

- To create new resolver, create a file inside `resolvers/` directory and register it inside server configuration:

```
schema: await buildSchema({
  resolvers: [
    ExampleResolver,
  ],
  ...
}),
```

- For user authentication we are using [JWT](https://github.com/auth0/node-jsonwebtoken#readme)

## Learn More

To learn more about stack that are used in this app, take a look at the following resources:

- [Express.js Documentation](https://expressjs.com/) - learn about Express.js features and API.
- [Typescript Documentation](https://www.typescriptlang.org/docs/) - learn about Typescript features and API.
- [GraphQL Documentation](https://graphql.org/learn/) - learn about GraphQL features and API.
- [TypeORM Documentation](https://typeorm.io/#/) - learn about TypeORM features and API.
