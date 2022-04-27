import { toast } from 'react-toastify'

export const toastMessage = (type, message) => {
  toast[type](message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}
