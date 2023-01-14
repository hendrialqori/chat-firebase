/* eslint-disable @typescript-eslint/no-misused-promises */
import type { FC } from 'react'
import React, { useState } from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { BsChatRightText } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { ModalLoading } from '../components/ModalLoading'
import { auth, storage, db } from '../configs/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'

const Register: FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [blobImage, setBlobImage] = useState<File>()
  const [blobImageError, setBlobError] = useState('')
  const navigate = useNavigate()

  const handleBlobImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const validationImageTypes = ['image/jpg', 'image/jpeg', 'image/png']
    const blobImageURL = e.target.files?.[0]

    if (!(validationImageTypes.includes((blobImageURL?.type) as unknown as string))) {
      setBlobError('file not available!')
      return
    }
    setBlobImage(blobImageURL)
  }

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    const formTarget =
        (e.target as unknown as Array<{ [key: string]: string }>)

    const username = formTarget[1].value // username
    const email = formTarget[2].value // email
    const password = formTarget[3].value // password
    const confirmPassword = formTarget[4].value // image

    if (password !== confirmPassword) {
      setErrorMessage('Password not same')
      return
    }
    if (blobImage == null) return

    try {
      setLoading(true) // Track loading process
      const createNewUser =
            await createUserWithEmailAndPassword(auth, email, password)

      const storageRef = ref(storage, username)
      const uploadTask = uploadBytesResumable(storageRef, blobImage as unknown as Blob)

      uploadTask.on('state_changed',
        (snapshot) => {},
        (_error) => {
          setLoading(false)
          setError(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              await updateProfile(createNewUser.user, {
                displayName: username,
                photoURL: downloadURL
              })
              await setDoc(doc(db, 'users', createNewUser.user.uid), {
                uid: createNewUser.user.uid,
                username,
                email,
                image: downloadURL
              })

              await setDoc(doc(db, 'userChats', createNewUser.user.uid), {})

              setLoading(false)
              navigate('/login')
            })
            .catch(error => {
              throw new Error((error as Error).message)
            })
        }
      )
    } catch (error) {
      setLoading(false)
      setError(true)
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
        <form onSubmit={handleRegister} className='w-6/12 px-6 py-4 flex flex-col gap-1 bg-white'>
          <section>
            <input onChange={handleBlobImage} style={{ display: 'none' }} type="file" id='image' />
            {
            (blobImage != null)
              ? <img src={URL.createObjectURL(blobImage)} className='h-14 w-14 mx-auto object-cover rounded-full shadow-md' alt='avatar' id='image' />
              : <>
              <label className='flex items-center justify-center rounded-full border-[1px] w-max mx-auto p-3' htmlFor="image" role={'button'} tabIndex={0}>
                  <BiImageAdd className='text-2xl' />
              </label>
              <p className='text-sm text-center mt-1'>{blobImageError}</p>
            </>
            }
          </section>
          <section aria-label='username-field' className='flex flex-col my-3'>
            <input
              type="text"
              className='border-b-[1px] p-1 outline-none font-semibold focus:border-none h-7'
              placeholder='username*'
              required
            />
          </section>
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
              <p className='text-xs mt-1'>* password must be 6 character of more</p>
          </section>
          <section aria-label='confirm-password-field' className='flex flex-col my-3 h-16'>
            <input
                type="password"
                className='border-b-[1px] p-1 outline-none font-semibold focus:border-none h-7'
                placeholder='password confirm*'
                required
              />
            <p className='text-sm text-rose-400'>{(errorMessage as unknown as boolean) || null}</p>
          </section>
          <button
            type="submit"
            className='bg-black text-white px-5 py-2 rounded-3xl hover:bg-black/80'
            disabled={!!loading}
            >
              Sign up
            </button>
          <p className='text-center'>
            Have an account ?{' '}
            <Link className='underline ' to={'/login'}>Login here</Link>
          </p>
          {loading ? <ModalLoading /> : null}
        </form>
      </main>
    </div>
  )
}

export default Register
