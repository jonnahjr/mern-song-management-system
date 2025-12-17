import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@emotion/react'
import { store } from './redux/store'
import { useAppSelector } from './redux/hooks'
import './index.css'
import App from './app/App.tsx'

const RootApp = () => {
  const theme = useAppSelector((state) => state.theme)
  console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RootApp />
  </Provider>,
)
