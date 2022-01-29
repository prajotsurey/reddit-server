# reddit-clone-server

Backend for a fullstack reddit clone.

Built using Typescript, TypeOrm, type-graphql and apollo-server-express. 
* [Installation](#user-content-installation)
* [Usage](#user-content-usage)

## Installation

1. Clone project

```bash
git clone https://github.com/prajotsurey/reddit-server.git
```

2. Install dependencies for API server.

```bash
npm install
```

4. Start PostgreSQL server
5. Create database named 'reddit'
6. Add a user with the username `postgres` and password `postgres`
7. Create a .env file with the following data
```
ACCESS_TOKEN_SECRET=<string>
REFRESH_TOKEN_SECRET=<string>
PORT=<string>
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/reddit
CORS_ORIGIN=<url for your frontend>
```
## Usage

1. Build to tsc

```bash
npm run watch
```

2. Start server

In a separate terminal
```bash
npm run dev
```
