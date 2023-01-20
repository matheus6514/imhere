import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://172.20.127.114:3333'
});