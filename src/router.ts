import { createRouter } from '@solidjs/router'
import { lazy } from 'solid-js'
import { hello } from './api.ts'

const About = lazy(() => import('./routes/About.tsx'))
const Index = lazy(() => import('./routes/Index.tsx'))
const NotFound = lazy(() => import('./routes/NotFound.tsx'))

export const Router = createRouter({
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

export const { paths } = Router
