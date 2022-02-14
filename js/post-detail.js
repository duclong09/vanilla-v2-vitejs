import dayjs from 'dayjs'
import postApi from './api/postApi'
import { setTextContent } from './utils'

function renderPostDetail(post){
    if(!post) return
    //render tittle
    setTextContent(document, '#postDetailTitle', post.title)
    //render des
    setTextContent(document, '#postDetailDescription', post.description)
    //render author
    setTextContent(document, '#postDetailAuthor', post.author)
    //render updateAt
    setTextContent(document, '#postDetailTimeSpan', dayjs(post.updateAt).format(' - DD/MM/YYYY HH:mm'))
    //render hero img
    const heroImage = document.getElementById('postHeroImage')
    if(heroImage){
        heroImage.style.backgroundImage =  `url("${post.imageUrl}")`
        heroImage.addEventListener('error', ()=>{
            console.log('load image error -> use default placeholder')
            heroImage.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
        })
    }
    //render edit page link
    const editPageLink = document.getElementById('goToEditPageLink')
    if(editPageLink){
        editPageLink.href = `/add-edit-post.html?id=${post.id}`
        editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
    }
}   
// id="goToEditPageLink
// id="postHeroImage
// id="postDetailTitle
// id="postDetailAuthor
// id="postDetailTimeSpan
// id="postDetailDescription



/*

author: "Charlene Herman"
createdAt: 1633700485638
description: "et veritatis dolores magni laborum id praesentium veniam quis nam repellendus sit aut nisi sit quod quas est sed dolores odit omnis commodi sapiente perspiciatis nam sequi libero consequuntur quas et velit qui beatae quibusdam aut nemo quisquam esse voluptates aspernatur magnam amet et nostrum sunt quo dicta neque et"
id: "sktwi1cgkkuif36dj"
imageUrl: "https://picsum.photos/id/371/1368/400"
title: "Dicta molestiae aut"
updatedAt: 1633700485638
*/


(async ()=>{
    //get post id from URL
    //fetch post detail api
    //render post detail

    try {
        const searchParams = new URLSearchParams(window.location.search)
        const postId = searchParams.get('id')
        if(!postId){
            console.log('not found')
            return
        }
        const post = await postApi.getById(postId)
        renderPostDetail(post)
    } catch (error) {
        console.log('failed to fetch post detail', error)
    }

   
   
})()