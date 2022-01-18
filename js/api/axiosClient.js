import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'https://js-post-api.herokuapp.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add a request interceptor
axiosClient.interceptors.request.use(
    function (config) {
      // Attach token to request if exists
      // Refresh token
      const accessToken = localStorage.getItem('access_token')
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
  
      return config
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error)
    }
  )

  axiosClient.interceptors.response.use(
    function (response){
        console.log('response interceptor', response)
        return response.data
    },
    function (error){
        return Promise.reject(error)
    }
  )

export default axiosClient
