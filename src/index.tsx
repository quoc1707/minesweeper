import './styles/colors.css'
import './styles/main.css'

import App from './components/App'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.querySelector('#root')!)

root.render(
    <StrictMode>
        <App />
    </StrictMode>
)
