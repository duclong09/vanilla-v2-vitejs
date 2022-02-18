import postApi from './api/postApi'
import { initPostForm, toast } from './utils';   

async function handlePostFormSubmit(formValues){
   //console.log('submit from parent', formValues)
    try {
        
        //check add/ edit
        //v1: based on search params check id
        //v2: check id in formValues

        //call api
        const savedPost = formValues.id
            ? await postApi.update(formValues)
            : await postApi.add(formValues)
      
        //show success message
        toast.success('Save post successfully!')
        //redirect to detail page
        setTimeout(() => {
            window.location.assign(`/post-detail.html?id=${savedPost.id}`)
        }, 2000);
        console.log('redirect form values', savedPost.id)
    } catch (error) {
        console.log('failed to save post', error)
        toast.error(`Error: ${error.message}`)
    }
}

 (async () => {
        try {
            const searchParams = new URLSearchParams(window.location.search)
            const postId = searchParams.get('id')

            let defaultValues = Boolean(postId) ? await postApi.getById(postId) : {
                title: '',
                description: '',
                author: '',
                imageUrl: '',
            }
            // console.log('id', postId)
            // console.log('mode:', postId ? 'edit' : 'add')
            // console.log('defaultValues:', defaultValues)


            initPostForm({
                formId: 'postForm',
                defaultValues,
                onSubmit: handlePostFormSubmit
            })
        } catch (error) {
            console.log('faild to fetch post details: ', error)
        }
    })()
