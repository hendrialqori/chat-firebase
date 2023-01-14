/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useRef } from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { RiWechatFill, RiSendPlaneFill } from 'react-icons/ri'
import { AnimatePresence, motion } from 'framer-motion'
import { useStoreUser, ActionType } from '../context/userContext'
import { ModalSetting } from './ModalSetting'
import { db } from '../configs/firebase'
import { onSnapshot, doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'
import { useStoreAuth } from '../context/authContext'

interface ChatsTypes {
  id: string
  text: string
  senderID: string
  date: string
}

const Messages = (): JSX.Element => {
  const { state, dispatch } = useStoreUser()
  const { currentUser } = useStoreAuth()
  const [text, setText] = useState('')
  const [chats, setChats] = useState<ChatsTypes[]>([])
  const chatsRef = useRef<HTMLElement | null>(null)

  const toggleModalAction = (): void => dispatch({ type: ActionType.TOGGLEMODAL })

  const toggleSettingAction = (): void => dispatch({ type: ActionType.TOGGLESETTING })

  const sendText = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    chatsRef.current?.scrollIntoView({ behavior: 'smooth' })

    try {
      await updateDoc(doc(db, 'chats', state.currentFriend.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderID: currentUser.uid,
          date: Timestamp.now()
        })
      })

      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [state.currentFriend.chatId + '.lastMessage']: {
          text
        },
        [state.currentFriend.chatId + '.date']: Timestamp.now()
      })

      await updateDoc(doc(db, 'userChats', state.currentFriend.userFriend.uid), {
        [state.currentFriend.chatId + '.lastMessage']: {
          text
        },
        [state.currentFriend.chatId + '.date']: Timestamp.now()
      })
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }

  useEffect(() => {
    let unsubscribe = false
    const realTimeGetChats = (): void => {
      if (!(state?.currentFriend?.chatId as unknown as boolean)) return
      onSnapshot(doc(db, 'chats', state?.currentFriend?.chatId), (doc) => {
        if (!unsubscribe) {
          setText('')
          doc.exists() && setChats(doc.data().messages as [])
        }
      })
    }

    realTimeGetChats()

    return () => {
      console.log('unsubs realTimeChats get')
      unsubscribe = true
    }
  }, [state.currentFriend?.chatId])

  useEffect(() => {
    chatsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats])

  return (
        <section className='w-8/12 relative' aria-label='messages'>
            <header className='flex items-center justify-between'>
                {(state.currentFriend.userFriend?.uid as unknown as boolean)
                  ? (
                <AnimatePresence>
                    <motion.figure
                    initial={{ opacity: 0, left: -50 }}
                    animate={{ opacity: 1, left: 0 }}
                    className='flex items-center gap-3'>
                        <img src={state.currentFriend.userFriend?.image} className="w-9 h-9 rounded-full" loading='lazy'/>
                        <h1 className='font-semibold'>{state.currentFriend.userFriend?.username}</h1>
                    </motion.figure>
                </AnimatePresence>
                    )
                  : null}
                <section className='flex items-center gap-1'>
                    <button onClick={toggleModalAction} className='p-2 rounded-full bg-white flex items-center justify-center shadow-md'>
                        <AiOutlineUserAdd className='text-xl'/>
                    </button>
                    <button onClick={toggleSettingAction} className='p-2 rounded-full bg-white flex items-center justify-center shadow-md'>
                        <BiDotsVerticalRounded className='text-xl' />
                    </button>
                    {state.toggleSetting ? <ModalSetting /> : null}
                </section>
            </header>
            <section className='mt-4 bg-white h-[90%] rounded-3xl p-2 flex flex-col justify-between' aria-label='message-body-container'>
                <section ref={chatsRef} className='py-5 pl-5 pr-3 flex flex-col gap-3 h-5/6 overflow-y-auto' aria-label='message-list-wrapper'>
                    {chats.length === 0
                      ? (
                        <div className='w-max mx-auto flex flex-col items-center gap-4'>
                          <RiWechatFill className='text-[5rem]' />
                          <p>Lets start conversation.</p>
                        </div>
                        )
                      : chats.map((chat) => (
                        <div key={chat.id} id={chat.senderID === currentUser.uid ? 'owner' : 'friend'}>
                            <p className='text-md font-[400]'>{chat.text}</p>
                        </div>
                      ))}
                </section>
                <form onSubmit={sendText} className='flex items-center gap-2'>
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        type="text"
                        className='w-full border-[1px] rounded-3xl outline-none px-3 py-3 font-normal'
                        placeholder='Type a message'
                    />
                    <button className='p-3 rounded-full flex items-center justify-center shadow-md bg-blue-900 text-white' type='submit'>
                        <RiSendPlaneFill />
                    </button>
                </form>
            </section>
        </section>
  )
}

export default Messages
