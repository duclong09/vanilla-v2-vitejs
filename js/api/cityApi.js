import axiosClient from './axiosClient'
 
export function getAllCities(params) {
  const url = '/posts'
  return axiosClient.get(url, { params})
}
export function getCityById(id) {
  const url = `/posts/${id}`
  return axiosClient.get(url)
}