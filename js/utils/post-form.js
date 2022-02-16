
import { setBackgroundImage, setTextContent } from "./common"
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

function getTitleError(form){
    const titleElement = form.querySelector('[name="title"]')
    if(!titleElement) return
    if(titleElement.validity.valueMissing) return 'Ooops! Please write a nice title for your post'

    if(titleElement.value.split(' ').filter((x) => !! x && x.length >= 3).length < 2){
        return 'Please enter at least two words of 3 character'
    }
    return ''
}

function getAuthorError(form){
    const authorElement = form.querySelector('[name="author"]')
    if(!authorElement) return
    if(authorElement.validity.valueMissing) return 'Please enter author of this post!'

    if(authorElement.value.split(' ').filter((x) => !! x && x.length >=3).length < 2){
        return 'Please enter at least two words of 3 character'
    }
    return ''
}


function validatePostForm(form, formValues){

    //get errors
    const errors = {
        title: getTitleError(form),
        author: getAuthorError(form)
    }
    //set errors
    for(const key in errors){
     const element = form.querySelector(`[name="${key}"]`)
     if(element){
        element.setCustomValidity(errors[key])
        setTextContent(element.parentElement, '.invalid-feedback', errors[key])
     }   
    }
    //add was-validated class to form element
    const isValid = form.checkValidity()
    if(!isValid) form.classList.add('was-validated')
    return false
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
        if(!validatePostForm(form,formValues)) return

        //trigger submit callback

        //otherwise, show validation errors
        
    })
}