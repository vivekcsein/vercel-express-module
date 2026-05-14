npm install vercel-express-module

````

## Usage

This module allows you to export your Express app instance directly for Vercel deployment without worrying about the underlying server listener logic.

### Basic Example

In your `api/index.js` (or your entry point):

```javascript
const express = require('express');
const { createVercelHandler } = require('vercel-express-module');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

app.get('/api/data', (req, res) => {
  res.json({ success: true, data: [] });
});

module.exports = createVercelHandler(app);
````

## How it Works

Vercel handles the HTTP server layer. This module ensures that the Express application instance is correctly wrapped into a function signature that Vercel expects: `(request, response) => void`.

1. **Request Parsing**: It ensures compatibility between Vercel's `VercelRequest` and Express's `Request`.
2. **Lifecycle Management**: It manages the request-response cycle within the serverless execution environment.

## Configuration

Ensure your `vercel.json` is configured to route requests to your entry file:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/api/index.js" }]
}
```
