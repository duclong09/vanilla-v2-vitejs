import postApi from './api/postApi'

    ; (async () => {
        try {
            const searchParams = new URLSearchParams(window.location.search)
            const postId = searchParams.get('id')

            let defaultValues = Boolean(postId) ? await postApi.getById(postId) : {
                title: '',
                description: '',
                author: '',
                imageUrl: '',
            }
            console.log('id', postId)
            console.log('mode:', postId ? 'edit' : 'add')
            console.log('defaultValues:', defaultValues)
        } catch (error) {
            console.log('faild to fetch post details: ', error)
        }
    })()
