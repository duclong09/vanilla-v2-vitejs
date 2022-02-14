import postApi from './api/postApi'
import {initPagination,initSearch,renderPagination, renderPostList} from './utils'
//to use formNow function
async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)

    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)
    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList('postsList',data)
    renderPagination('pagination',pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

;(async () => {
  try {
    const url = new URL(window.location)
    //update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const queryParams = url.searchParams

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page)
    })

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value)
    })

    //const queryParams = getDefaultParams()
    //const queryParams = new URLSearchParams(window.location.search)
    //set defaul
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList('postsList', data)
    renderPagination( 'pagination',pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()

