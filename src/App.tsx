import { createRouter, type RouteSectionProps } from '@solidjs/router'
import { lazy } from 'solid-js'
import { hello } from './api.ts'

const About = lazy(() => import('./routes/About.tsx'))
const Index = lazy(() => import('./routes/Index.tsx'))
const NotFound = lazy(() => import('./routes/NotFound.tsx'))

const Router = createRouter({
  routes: [
    {
      path: '/',
      component: Index,
      preload() {
        void hello()
      },
    },
    { path: '/about', component: About },
    { path: '*404', component: NotFound },
  ],
})

function Layout(props: RouteSectionProps) {
  return (
    <main class="site-shell">
      <header class="site-header">
        <a class="brand" href="/">Solid / SSR</a>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <div class="route-stage">{props.children}</div>
      <footer>
        <span>Solid 2</span>
        <span>Streaming enabled</span>
      </footer>
    </main>
  )
}

export default function App() {
  return (
    <Router>
      {props => <Layout {...props} />}
    </Router>
  )
}
