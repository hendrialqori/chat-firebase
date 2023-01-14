import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthContextProvider } from './context/authContext';
import { UserContextProvider } from './context/userContext';


const _ROOT = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
_ROOT.render(
    <AuthContextProvider>
        <UserContextProvider>
            <App />
        </UserContextProvider>
    </AuthContextProvider>
)
