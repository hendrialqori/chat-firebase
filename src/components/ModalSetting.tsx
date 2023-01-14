/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
/* eslint-disable react/react-in-jsx-scope */
import { AnimatePresence, motion } from 'framer-motion'
import { IoMdLogOut } from 'react-icons/io'
import { BsSunFill } from 'react-icons/bs'
import { HiMoon } from 'react-icons/hi'
import { FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { ActionType, useStoreUser } from '../context/userContext'
import { auth } from '../configs/firebase'
import { signOut } from 'firebase/auth'

export const ModalSetting = (): JSX.Element => {
  const { dispatch } = useStoreUser()
  const navigate = useNavigate()
  const logOut = async (): Promise<void> => {
    try {
      await signOut(auth)
      dispatch({ type: ActionType.CLEARCHOOSEUSER })
      navigate('/login')
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }
  return (
       <AnimatePresence>
            <motion.section
                initial={{ opacity: 0, top: 70 }}
                animate={{ opacity: 1, top: 50 }}
                className="w-max absolute z-5 bg-white rounded-xl right-4 top-12 shadow-md overflow-hidden"
            >
                <button className="flex items-center gap-3 font-semibold p-3 w-full hover:bg-gray-100">
                    <FaUser className="text-xl text-sky-700" />
                    User
                </button>
                <button className="flex items-center gap-3 font-semibold p-3 hover:bg-gray-100">
                    <BsSunFill className="text-xl text-yellow-400" />
                    Light mode
                </button>
                <button className="flex items-center gap-3 font-semibold p-3 hover:bg-gray-100">
                    <HiMoon className="text-xl text-yellow-400" />
                    Dark mode
                </button>
                <button onClick={logOut} className="flex items-center gap-3 font-semibold p-3 w-full hover:bg-gray-100">
                    <IoMdLogOut className="text-xl" />
                    Logout
                </button>
            </motion.section>
       </AnimatePresence>
  )
}
