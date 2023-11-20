import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import {Auth0Provider}  from '@auth0/auth0-react'
import { MovieProvider } from './context/movieContext.tsx'

const {VITE_AUTH0_DOMAIN: domain, VITE_AUTH0_CLIENT_ID: clientId} =import.meta.env
const redirect_uri: string = window.location.origin

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider 
      domain={domain} 
      clientId={clientId} 
      authorizationParams={{redirect_uri}}>
      <MovieProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </MovieProvider>
    </Auth0Provider>
  </React.StrictMode>,
)
