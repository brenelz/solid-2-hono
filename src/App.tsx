import type { RouteSectionProps } from '@solidjs/router'
import { paths, Router } from './router.ts'

function Layout(props: RouteSectionProps) {
  return (
    <main class="site-shell">
      <header class="site-header">
        <a class="brand" href={paths()}>Solid / SSR</a>
        <nav aria-label="Primary navigation">
          <a href={paths()}>Home</a>
          <a href={paths.about}>About</a>
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
