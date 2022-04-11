import axios from 'axios'
import { API_URL, MAIN_API_URL } from './constant'
import { format, parseISO } from 'date-fns'

export const serviceAuthManager = (url, method = 'get', data = {}, isMain) => {
  return axios({
    url: isMain ? MAIN_API_URL + url : API_URL + url,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('id_token'),
    },
    method,
    data,
  })
}

export const dateFormatHandler = (dateString, isTime) => {
  return format(parseISO(dateString), isTime ? 'dd-MM-yyyy h:mm aa' : 'dd-MM-yyyy')
}
