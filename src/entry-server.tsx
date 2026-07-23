/* @refresh reload */
import './index.css'

import { renderToStream, type RequestEvent } from '@solidjs/web'
import { provideRequestEvent } from '@solidjs/web/storage'
import manifest from 'virtual:solid-manifest'
import App from './App.tsx'
import HtmlDocument, { type DocumentAssets } from './HtmlDocument.tsx'

function getDocumentAssets(): DocumentAssets {
  if (import.meta.env.DEV) {
    return {
      entry: '/src/entry-client.tsx',
      css: [{ href: '/src/index.css' }],
    }
  }

  const entry = manifest['src/entry-client.tsx']

  if (!entry) throw new Error('Client entry is missing from the Vite manifest')

  const base = manifest._base?.endsWith('/')
    ? manifest._base
    : `${manifest._base ?? ''}/`
  const assetUrl = (file: string) => `${base}${file.replace(/^\//, '')}`

  return {
    entry: assetUrl(entry.file),
    css: (entry.css ?? []).map(file => ({ href: assetUrl(file) })),
  }
}

const assets = getDocumentAssets()
const doctype = new TextEncoder().encode('<!doctype html>')
const devStylePatch = import.meta.env.DEV
  ? (await import('vite-plugin-solid')).devStylePatch
  : undefined

export default {
  fetch(request: Request) {
    const response: RequestEvent['response'] = {
      headers: new Headers({
        'content-type': 'text/html; charset=utf-8',
      }),
    }

    return provideRequestEvent({ request, locals: {}, response }, () => {
      const output = renderToStream(() => (
        <HtmlDocument
          assets={assets}
          viteDev={import.meta.env.DEV}
          devStylePatch={devStylePatch}
        >
          <App />
        </HtmlDocument>
      ), {
        manifest,
        onError(error) {
          console.error(error)
        },
      })
      const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>({
        start(controller) {
          controller.enqueue(doctype)
        },
      })

      void output.pipeTo(writable).catch(error => {
        console.error('SSR stream failed', error)
      })

      return new Response(readable, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    })
  },
}
