## Usage

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the browser bundle to `dist/client` and the Hono server to `dist/server`.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run preview`

Starts the production Hono server at [http://localhost:3000](http://localhost:3000).
Set `PORT` to use a different port.

## Deployment

Run `node dist/server/index.js` from the project root on a Node.js host. The server serves the generated client assets and handles Solid SSR and server functions.
