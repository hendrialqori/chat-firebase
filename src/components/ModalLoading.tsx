/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { LoadingSpin } from './LoadingSpin'

export const ModalLoading = () => {
  return (
        <section className="fixed inset-0 h-[100vh] w-[100%] flex items-center justify-center bg-black/90">
            <LoadingSpin />
        </section>
  )
}
