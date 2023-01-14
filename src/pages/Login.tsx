/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/react-in-jsx-scope */
import { FC, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../configs/firebase'
import { useNavigate, Link } from 'react-router-dom'
import { BsChatRightText } from 'react-icons/bs'
import { LoadingSpin } from '../components/LoadingSpin'

const Login: FC = () => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMesaage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault()

    const formTarget =
            (e.target as unknown as Array<{ [key: string]: string }>)

    const email = formTarget[0].value
    const password = formTarget[1].value
    const confirmPassword = formTarget[2].value

    if (password !== confirmPassword) {
      setErrorMesaage('Password not same')
      return
    }

    try {
      setLoading(true)
      const login = await signInWithEmailAndPassword(auth, email, password)
      if (login.user as unknown as boolean) {
        return navigate('/')
      }
    } catch (error) {
      setLoading(false)
      throw new Error((error as Error).message)
    }
  }

  return (
    <div className='h-[100vh] w-[100%] flex items-center justify-center bg-white'>
      <main className='flex justify-center items-center rounded-3xl shadow-sm bg-white w-[765px] mx-auto'>
        <section className='flex flex-col items-center justify-center w-6/12'>
          <BsChatRightText className='text-[3rem]' />
          <h1 className='font-extrabold text-xl tracking-[.8rem] mt-3'>OURCHAT</h1>
        </section>
        <form onSubmit={handleLogin} className='w-6/12 px-6 py-4 flex flex-col gap-1 bg-white'>
          <h1 className='text-lg'>Start conversation with people around the world.</h1>
          <section aria-label='email-field' className='flex flex-col my-3'>
            <input
              type="email"
              className='border-b-[1px] p-1 outline-none font-semibold focus:border-none h-7'
              placeholder='email*'
              required
            />
          </section>
          <section aria-label='password-field' className='flex flex-col my-3'>
            <input
                type="password"
                className='border-b-[1px] p-1 outline-none font-semibold focus:border-none h-7'
                placeholder='password*'
                required
              />
          </section>
          <section aria-label='confirm-password-field' className='flex flex-col my-3 h-16'>
            <input
                type="password"
                className='border-b-[1px] p-1 outline-none font-semibold focus:border-none h-7'
                placeholder='password confirm*'
                required
              />
              {errorMessage as unknown as boolean ? <p className='text-xs text-red-400 ml-2 mt-2'>{errorMessage}</p> : null}
          </section>
          <button
            type="submit"
            className='bg-black text-white px-5 py-2 rounded-3xl hover:bg-black/80'
            disabled={!!loading}
            >
              {loading ? <LoadingSpin /> : 'Sign in'}
            </button>
          <p className='text-center'>
            Dont have an account ?{' '}
            <Link className='underline ' to={'/register'}>Register here</Link>
          </p>
        </form>
      </main>
    </div>
  )
}

export default Login
