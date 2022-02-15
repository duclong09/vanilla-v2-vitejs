import dayjs from 'dayjs'
import postApi from './api/postApi'
import { registerLightBox, setTextContent } from './utils'

function renderPostDetail(post) {
  if (!post) return
  //render tittle
  setTextContent(document, '#postDetailTitle', post.title)
  //render des
  setTextContent(document, '#postDetailDescription', post.description)
  //render author
  setTextContent(document, '#postDetailAuthor', post.author)
  //render updateAt
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updateAt).format(' - DD/MM/YYYY HH:mm')
  )
  //render hero img
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`
    heroImage.addEventListener('error', () => {
      console.log('load image error -> use default placeholder')
      heroImage.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
    })
  }
  //render edit page link
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit post'
  }
}

;(async () => {
  registerLightBox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  })
  try {
    //get post id from URL
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) {
      console.log('not found')
      return
    }
    //fetch post detail api
    const post = await postApi.getById(postId)
    //render post detail
    renderPostDetail(post)
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
