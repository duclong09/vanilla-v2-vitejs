import axiosClient from './api/axiosClient'
import { getAllCities, getCityById } from './api/cityApi'
import postApi from './api/postApi'

console.log('long')

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const data = await postApi.getAll(queryParams)
    console.log(data)
  } catch (error) {
    console.log('get all failed', error)
  }

  await postApi.updateFormData({
    id: 'sktwi1cgkkuif36do',
    title: 'adipisci a enim 111',
  })
}
main()



