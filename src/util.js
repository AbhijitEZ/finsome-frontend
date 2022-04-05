import axios from 'axios'
import { API_URL } from './constant'
import { format, parseISO } from 'date-fns'

export const serviceAuthManager = (url, method = 'get', data = {}) => {
  return axios({
    url: API_URL + url,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('id_token'),
    },
    method,
    data,
  })
}

export const dateFormatHandler = (dateString) => {
  return format(parseISO(dateString), 'MM-dd-yyyy H:m')
}
