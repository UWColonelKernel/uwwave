import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './routes/components/ErrorBoundary'
import { Routes } from './routes/Routes'
import GlobalStyle from './styles/global'

export const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <h1>Hello world

</h1>
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
    </BrowserRouter>
  )
}
