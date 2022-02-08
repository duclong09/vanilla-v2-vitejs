import postApi from './api/postApi'
import { getUlPagination, setTextContent, truncateText } from './utils'
import debounce from 'lodash.debounce'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
//to use formNow function
dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return

  //find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return
  //update titlte
  // const titleElement = liElement.querySelector('[data-id="title"]')
  // if(titleElement) titleElement.textContent = post.title

  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)

  // const descriptionElement = liElement.querySelector('[data-id="description"]')
  // if(descriptionElement) descriptionElement.textContent = post.description

  // const authorElement = liElement.querySelector('[data-id="author"]')
  // if(authorElement) authorElement.textContent = post.author

  //cacl timespan
  //console.log('timespan', dayjs(post.updatedAt).fromNow())

  setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`)

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl
    thumbnailElement.addEventListener('error', () => {
      console.log('load image error -> use default placeholder')
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
    })
  }

  return liElement
}

function renderPostList(postList) {
  console.log({ postList })
  if (!Array.isArray(postList)) return
  const ulElement = document.getElementById('postsList')
  if (!ulElement) return
  //clear current list
  ulElement.textContent = ''
  postList.forEach((post, idx) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination()
  if (!pagination || !ulPagination) return
  const { _page, _limit, _totalRows } = pagination
  //calc totalPages
  const totalPages = Math.ceil(_totalRows / _limit)

  //save page and totoalPages to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages
  //check if enaable / disable prev/next link
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disable')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disable')
}

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)

    if(filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)
    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

function handlePrevClick(e) {
  e.preventDefault()
  console.log('click')

  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return
  handleFilterChange('_page', page - 1)
}
function handleNextClick(e) {
  e.preventDefault()
  console.log('click')

  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = ulPagination.dataset.totalPages
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

function initPagination() {
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  //add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }
  //add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

function initURL() {
  const url = new URL(window.location)
  //update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
  history.pushState({}, '', url)
}

function initSearch() {
  const searchInput = document.getElementById('searchInput')
  if (!searchInput) return
  //set default values from query params

  //title search
  const queryParams = new URLSearchParams(window.location.search)
  if(queryParams.get('title_like')){
    searchInput.value = queryParams.get('title_like')
  }
  const debounceSearch = debounce(
    (event) => handleFilterChange('title_like', event.target.value),
    500
  )
  searchInput.addEventListener('input', debounceSearch)
}

;(async () => {
  try {
    initPagination()
    initSearch()
    initURL()
    const queryParams = new URLSearchParams(window.location.search)
    //set defaul
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
