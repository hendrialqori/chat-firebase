/* eslint-disable no-return-assign */
/* eslint-disable multiline-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/react-in-jsx-scope */
import { doc, onSnapshot } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { useStoreUser, ActionType } from '../context/userContext'
import { BiSearch } from 'react-icons/bi'
import { db } from '../configs/firebase'
import { useStoreAuth } from '../context/authContext'
import { useEffect, useState } from 'react'

export const Sidebar = (): JSX.Element => {
  const { dispatch } = useStoreUser()
  const { currentUser } = useStoreAuth()
  const [friendsChat, setFriendChat] = useState<DocumentData>({})

  useEffect(() => {
    let unsubscribe = false
    const realTimeGetUserChats = (): void => {
      onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        if (!unsubscribe) {
          setFriendChat(doc.data() as DocumentData)
        }
      })
    }

    realTimeGetUserChats()
    return () => {
      unsubscribe = true
    }
  }, [currentUser.uid])

  const chooseUser = (user: [string, any]): void => {
    const userFriend = {
      uid: user[1].userInfo.uid,
      username: user[1].userInfo.username,
      image: user[1].userInfo.image

    }
    dispatch({
      type: ActionType.CHOOSEUSER,
      payload: {
        chatId:
        currentUser.uid > user[1].userInfo.uid
          ? currentUser.uid + user[1].userInfo.uid
          : user[1].userInfo.uid + currentUser.uid,
        userFriend
      }
    })
  }
  console.log(Object.entries(friendsChat).length === 0 ? 'ya' : 'false')
  return (
    <section className='w-4/12' aria-label='sidebar'>
        <section className="relative">
            <input
            type='text'
            className='w-full rounded-3xl px-4 py-3 outline-sky-300 text-[14px] font-semibold border-[1px]'
            placeholder='Search friend ..'
            />
            <BiSearch className="absolute top-3 right-4 text-2xl text-gray-500" />
        </section>
         <section className=' bg-white rounded-3xl overflow-y-scroll py-3 mt-4 flex flex-col h-[90%]' aria-label='chats-friend-wrapper'>
          {Object.entries(friendsChat).length === 0 ? <p className='text-sm fonf-[400] text-center'>Add new friend for continue chat!</p>
            : Object.entries(friendsChat)
              ?.sort((a, b) => b[1].date = a[1].date).map((user, i) => (
            <figure key={i} onClick={() => chooseUser(user)} className=' bg-white p-3 flex justify-between border-b-[1px] border-gray-100 hover:bg-gray-100' role={'button'} tabIndex={0}>
              <section className='flex items-center gap-2'>
              <img src={user[1].userInfo?.image} className="w-12 h-12 rounded-full" loading='lazy'/>
              <figcaption className='leading-6'>
                  <h1 className='font-semibold text-[14px]'>{user[1].userInfo?.username}</h1>
                  <p className='font-[500] text-gray-500 text-xs'>{user[1]?.lastMessage?.text}</p>
              </figcaption>
              </section>
              <span className='font-semibold text-xs'>20:09</span>
            </figure>
              ))}
          </section>
    </section>
  )
}
