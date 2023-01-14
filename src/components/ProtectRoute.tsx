/* eslint-disable react/react-in-jsx-scope */
import { Navigate } from 'react-router-dom'
import { useStoreAuth } from '../context/authContext'

export const Protect =
     ({ children }: { children: React.ReactNode }): JSX.Element => {
       const { currentUser } = useStoreAuth()
       if (!(currentUser.uid as unknown as boolean)) {
         return <Navigate to={'/login'} />
       }
       return children as JSX.Element
     }
