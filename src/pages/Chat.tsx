/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-tabs */
import type { FC } from 'react'
import { ModalAddFriends } from '../components/ModalAddFriend'
import Messages from '../components/Messages'
import { Sidebar } from '../components/Sidebar'
import { useStoreUser } from '../context/userContext'
import { BsChatRightText } from 'react-icons/bs'
import { lazy, Suspense } from 'react'

// const Messages = lazy(async () => await import('../components/Messages'))

const Chats: FC = () => {
  const { state } = useStoreUser()
  return (
	<div className='font-OpenSans bg-white relative p-2 w-11/12 lg:w-8/12 mx-auto mt-2 lg:mt-10 rounded-3xl shadow-lg'>
    <header className='flex items-center p-2 ml-2 gap-2'>
      <BsChatRightText className='text-2xl' />
    </header>
    {state.toggleModal ? <ModalAddFriends /> : null}
    <main className='flex gap-3 h-[550px] w-full pt-5'>
      <Sidebar />
      {/* <Suspense fallback={<p>Load chats from the server ...</p>}> */}
        <Messages />
      {/* </Suspense> */}
    </main>
	</div>
  )
}

export default Chats

// Design inspiration https://dribbble.com/shots/16507884-Chatbot
