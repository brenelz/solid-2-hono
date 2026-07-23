import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import {
  endpoint,
  handleServerFunctionRequest,
} from 'virtual:solid-server-function-handler'
import { createFlightDataCollector, createNoJSHandler } from '@solidjs/router/server'
import renderer from '../src/entry-server.tsx'
import { Router } from '../src/router.ts'

// Single-flight: the router's preload runner produces the revalidated route
// data for the post-mutation URL straight off the configured route tree —
// no app render involved.
const collectFlightData = createFlightDataCollector(Router)

// No-JS form posts redirect back (303) with the outcome in the router's
// flash cookie; the router seeds submission state from it on the next SSR.
const handleNoJS = createNoJSHandler()

const app = new Hono<{ Variables: { requestId: string } }>()

if (import.meta.env.PROD) {
  app.use('*', serveStatic({ root: './dist/client' }))
}

app.use('*', async (context, next) => {
  const requestId = crypto.randomUUID()

  context.set('requestId', requestId)
  context.req.raw.headers.set('x-request-id', requestId)

  await next()
})

app.all(endpoint, context => handleServerFunctionRequest(context.req.raw, {
  createEvent(request: Request) {
    return {
      request,
      locals: { requestId: context.get('requestId') },
    }
  },
  collectFlightData,
  handleNoJS,
}))
app.all('*', context => renderer.fetch(context.req.raw))

export default app
