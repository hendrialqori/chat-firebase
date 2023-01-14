/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../configs/firebase'
import type { User as UserTypeFirebase } from 'firebase/auth'

interface InitTypesContext<T> {
  currentUser: T
}

const AuthContext = createContext({} as InitTypesContext<UserTypeFirebase>)

const AuthContextProvider =
     ({ children }: { children: React.ReactNode }): JSX.Element => {
       const [currentUser, setCurrentUser] = useState({} as UserTypeFirebase)
       useEffect(() => {
         const unsub = onAuthStateChanged(auth, (user) => (
           setCurrentUser((user as UserTypeFirebase))
         ))

         return () => {
           unsub()
         }
       }, [])

       return (
            <AuthContext.Provider value={{ currentUser }}>
                {children}
            </AuthContext.Provider>
       )
     }

const useStoreAuth = (): InitTypesContext<UserTypeFirebase> => useContext(AuthContext)

export { AuthContextProvider, useStoreAuth }
