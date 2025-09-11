import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import Admin from './admin/admin.tsx'
//import AdminNavigation from "./admin/admin-navigation"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div>
    {/* <App /> */}
    <Admin/>

    </div>
    
  </StrictMode>,
)
