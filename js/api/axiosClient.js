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
      console.log('axiosClient - response error', error.response)

      if(!error.response) throw new Error('Network error.')
      //redirect to login if not login
      if(error.response.status === 401){
        window.location.assign('/login.html')
        return
      }
      //return Promise.reject(error)
      throw new Error(error)
    }
  )

export default axiosClient
