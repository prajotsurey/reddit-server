# reddit-clone-server

Backend for a fullstack reddit clone.

Built using Typescript, TypeOrm, type-graphql and apollo-server-express. 
* [Installation](#user-content-installation)
* [Usage](#user-content-usage)
* [Deployment](#user-content-deployment)
* [Guides](#user-content-guides)
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

## Deployment

This server is deployed on AWS. It uses Elastic Beanstalk(EB) for deployment. EB requires you to upload a zip of the source code to deploy it.
Instead of deploying the entire app, deploy only the compiled (javascript) code.

1. Build via tsc. This will created compiled JS code in the build directory.

```bash
npm run build
```

2. Copy the dist folder to a different location. Also copy the package.json, package-lock.json and ormconfig.json to that location.

Your folder structure should look like this.

```bash
    ├── dist
    ├── package.json
    ├── package-lock.json
    └── ormconfig.json
```
3. REMOVE bcrypt FROM THE LIST OF DEPENDENCIES. 

EB runs npm install on it's on after code upload. This install breaks due to bcrypt requiring extra permissions. As a result it has to be removed from the dependencies. Instead, it needs to be installed after the 'npm install' is complete (which happens automatically at the beginning) and before 'npm start'.
To do this, edit the 'start' script in packge.json as follows:

4. Edit the 'start' script to the following

```bash
"start": "npm install bcrypt && node dist/index.js"
```
5. Make sure you do not have bcrypt in the dependencies in package.json
6. Create a zip containing dist folder, package.json, package-lock.json, ormconfig.json. These files need to be in the root level of the zip. Do not include the folder containing these files.

7. The zip is now ready to upload on Elastic Beanstalk.

## Guides

[Deploying to aws EB](https://medium.com/swlh/deploy-https-node-postgres-redis-react-to-aws-ef252567200d)

Do not follow step 10. It uses certbot-auto to generate ssl certificate which is no longer supported/working. Follow below tutorial for enabling ssl.

[Enabling SSL without a custom domain](https://www.linkedin.com/pulse/how-connect-your-backend-api-elastic-beanstalk-cloudfront-kamau/)



