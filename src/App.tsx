/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import React, { FC, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Protect } from './components/ProtectRoute'
import { AnimatePresence } from 'framer-motion'

const Chats = lazy(async () => await import('./pages/Chat'))
const Login = lazy(async () => await import('./pages/Login'))
const Register = lazy(async () => await import('./pages/Register'))

interface LazyTypes {
  children: React.ReactNode
  loading?: boolean
}

const WrapperLazyComponent = ({ children, loading }: LazyTypes): JSX.Element => {
  return (
    <Suspense fallback={(loading === true) && <p>Loading ...</p>}>
      {children}
    </Suspense>
  )
}

// interface RouteTypes {
//   index?: boolean
//   path: string
//   children: React.ReactNode
//   loading?: boolean
// }

// const ProtecRoute = ({ loading, children, ...rest }: RouteTypes): React.ReactElement => {
//   return (
//      <Route {...rest} element={
//       <Protect>
//         <Suspense fallback={(loading === true) && <p>Loading ...</p>}>
//           {children}
//         </Suspense>
//       </Protect>
//     } />
//   )
// }

const App: FC = () => {
  const location = window.location
  return (
    <BrowserRouter>
      <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            <Route path='/'>
              <Route index element={
                <Protect>
                  <WrapperLazyComponent children={<Chats />} loading={true} />
                </Protect>
              }/>
              <Route path='login' element={
                <WrapperLazyComponent children={<Login />} loading={false} />
              }/>
              <Route path='register' element={
                <WrapperLazyComponent children={<Register />} loading={false} />
              }/>
            </Route>
          </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App
