# Basic REST API Sandbox

This is a simple REST API with one CRUD flow, written by MVC pattern.

Stack: NodeJS, Express, MongoDB.

The project has nice error-handling, server-side validation, protected routes, and basic authorization using PassportJS.

You can easily to test api, using Swagger. Visit `http:localhost:8000/api-docs` endpoint in your browser.

----
## Installation

```bash
# Install the dependencies with npm

$ npm install
```

## Run

For development:
```sh
$ npm run dev
```
## FAQ

### Invalid connection string
If you got this error in the terminal, you need to create/replace `DATABASE` field in local `.env` file on your own database connection string
