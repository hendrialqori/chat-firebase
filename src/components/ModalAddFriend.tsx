/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStoreUser, ActionType } from '../context/userContext'
import { AiOutlineUserAdd } from 'react-icons/ai'
import {
  collection,
  query, where, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp
} from 'firebase/firestore'
import { db } from '../configs/firebase'
import { LoadingSpin } from './LoadingSpin'
import type { UserTypes } from '../types'
import { useStoreAuth } from '../context/authContext'

export const ModalAddFriends = (): JSX.Element => {
  const { currentUser } = useStoreAuth()
  const { dispatch } = useStoreUser()

  const [search, setSearch] = useState('')
  const [user, setUser] = useState<UserTypes>({
    uid: '',
    username: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const closeModal = (): void => dispatch({ type: ActionType.TOGGLEMODAL })

  const getUsersFirestore = async (): Promise<void> => {
    const usersRef = collection(db, 'users')
    const queries = query(usersRef, where('username', '==', search))

    try {
      setLoading(true)
      const usersResult = await getDocs(queries)
      if (!usersResult.empty) {
        usersResult.forEach((user: any) => {
          setUser(user.data())
        })
      } else {
        setErrorMsg('User not found')
      }
    } catch (error) {
      throw new Error((error as Error).message)
    }
    setLoading(false)
  }

  const handleSearch = (e: React.KeyboardEvent): any => {
    return e.key === 'Enter' && getUsersFirestore()
  }

  const handleSelectUser = async (): Promise<void> => {
    const combineId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid

    try {
      setLoading(true)
      const chatsCollection = await getDoc(doc(db, 'chats', combineId))

      if (!chatsCollection.exists()) {
        // create a chat is chats collection
        await setDoc(doc(db, 'chats', combineId), { messages: [] })
        // setUpdateUserChats(true)
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [`${combineId}.userInfo`]: {
            uid: user.uid,
            username: user.username,
            image: user.image
          },
          [`${combineId}.date`]: serverTimestamp()
        })

        await updateDoc(doc(db, 'userChats', user.uid), {
          // update nested object [combineId + '.userInfo']
          [combineId + '.userInfo']: {
            uid: currentUser.uid,
            username: currentUser.displayName,
            image: currentUser.photoURL
          },
          [combineId + '.date']: serverTimestamp()
        })

        dispatch({ type: ActionType.TOGGLEMODAL })
      }
      setLoading(false)
    } catch (error) {
      console.table(error)
    }
  }

  return (
        <AnimatePresence>
          <motion.section
            initial={{ opacity: 0, top: -50 }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: -50 }}
            className="fixed inset-0 flex justify-center items-center bg-gray-100/50 z-10 "
            onClick={closeModal}
            >
              <section onClick={e => e.stopPropagation()} className="bg-white rounded-3xl shadow-md p-5 w-5/12">
                <input
                    onChange={e => setSearch(e.target.value)}
                    value={search}
                    onKeyDown={handleSearch}
                    type="text"
                    className="w-full bg-gray-100/40 outline-green-100 rounded-3xl p-3 font-[600] placeholder:text-sm"
                    placeholder="Search friend! *Press enter after fill the blank"
                  />
                <section className="mt-3" aria-label="users-list-container">
                  {loading as unknown as boolean
                    ? <LoadingSpin />
                    : user.uid as unknown as boolean
                      ? <figure
                          key={user.uid}
                          className=' bg-white p-3 flex justify-between border-b-[1px] border-gray-100 hover:bg-gray-100 rounded-xl'
                          role={'button'}
                          tabIndex={0}
                          onClick={handleSelectUser}
                          >
                          <section className='flex items-center gap-2'>
                          <img src={user.image} className="w-9 h-9 rounded-full" loading='lazy'/>
                          <h1 className='font-semibold text-[13px]'>{user.username}</h1>
                          </section>
                          <button>
                              <AiOutlineUserAdd className="text-lg" />
                          </button>
                        </figure>
                      : errorMsg as unknown as boolean ? <p className='p-2 text-sm font-semibold'>{errorMsg}</p> : null}
                </section>
              </section>
          </motion.section>
        </AnimatePresence>
  )
}
