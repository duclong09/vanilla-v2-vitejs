import { setBackgroundImage } from "./common"
import { setFieldValue } from "./common"

function setFormValues(form, formValues){
    setFieldValue(form, '[name="title"]', formValues?.title)
    setFieldValue(form, '[name="author"]', formValues?.author)
    setFieldValue(form, '[name="description"]', formValues?.description)
    //hiden field
    setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl)
    setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}


//create form value
function getFormValues(form){
    const formValues = {}; 
    //v1 : query each input and add to values object
    // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
    //     const field = form.querySelector(`[name="${name}"]`)
    //     if(field) formValues[name] = field.value
    // })

    //v2: using form data

    const data = new FormData(form)
    for(const[key,value] of data){
        formValues[key] = value
    }
    return formValues
}

export function initPostForm({formId, defaultValues, onSubmit}){
    const form = document.getElementById(formId)
    if(!form) return
    console.log('form', form)
    setFormValues(form, defaultValues)

    form.addEventListener('submit', (event) => {
        event.preventDefault()
        //get form value
        const formValues = getFormValues(form)
        console.log(formValues)
        //validation js


        //trigger submit callback

        //otherwise, show validation errors
        
    })
}