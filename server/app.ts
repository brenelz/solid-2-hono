import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import {
  endpoint,
  handleServerFunctionRequest,
} from 'virtual:solid-server-function-handler'
import renderer from '../src/entry-server.tsx'

const app = new Hono()

if (import.meta.env.PROD) {
  app.use('*', serveStatic({ root: './dist/client' }))
}

app.all(endpoint, context => handleServerFunctionRequest(context.req.raw))
app.all('*', context => renderer.fetch(context.req.raw))

export default app
