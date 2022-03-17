import axios from 'axios'
import { API_URL } from './constant'

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
