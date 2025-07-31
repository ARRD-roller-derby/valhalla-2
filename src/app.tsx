// @refresh reload
import { MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import './app.css'
import { SessionProvider } from '@solid-mediakit/auth/client'
import { Layout } from './feature/Layout/Layout'

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Valhalla</Title>
          <Suspense>
            <SessionProvider>
              <Layout>{props.children}</Layout>
            </SessionProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
