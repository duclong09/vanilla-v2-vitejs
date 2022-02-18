import { setBackgroundImage, setTextContent } from './common'
import { setFieldValue } from './common'
import * as yup from 'yup'

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title)
  setFieldValue(form, '[name="author"]', formValues?.author)
  setFieldValue(form, '[name="description"]', formValues?.description)
  //hiden field
  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl)
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}

//create form value
function getFormValues(form) {
  const formValues = {}
  //v1 : query each input and add to values object
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name="${name}"]`)
  //     if(field) formValues[name] = field.value
  // })

  //v2: using form data

  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}

// function getTitleError(form) {
//   const titleElement = form.querySelector('[name="title"]')
//   if (!titleElement) return
//   if (titleElement.validity.valueMissing) return 'Ooops! Please write a nice title for your post'

//   if (titleElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2) {
//     return 'Please enter at least two words of 3 character'
//   }
//   return ''
// }

// function getAuthorError(form) {
//   const authorElement = form.querySelector('[name="author"]')
//   if (!authorElement) return
//   if (authorElement.validity.valueMissing) return 'Please enter author of this post!'

//   if (authorElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2) {
//     return 'Please enter at least two words of 3 character'
//   }
//   return ''
// }

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValues) {
  //get errors
  //   const errors = {
  //     title: getTitleError(form),
  //     author: getAuthorError(form),
  //   }
  //   //set errors
  //   for (const key in errors) {
  //     const element = form.querySelector(`[name="${key}"]`)
  //     if (element) {
  //       element.setCustomValidity(errors[key])
  //       setTextContent(element.parentElement, '.invalid-feedback', errors[key])
  //     }
  //   }
  try {
    //reset previous errors
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))
    //validation
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path
        //ignore if the field is already logged
        if (errorLog[name]) continue
        //set field error and mark as logged
        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }
  //add was-validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

function showLoading(form){
  const button = form.querySelector('[name="submit"]')
  if(button){
    button.disabled = true
    button.textContent = 'Saving...'
  }
}

function hideLoading(form){
  const button = form.querySelector('[name="submit"]')
  if(button){
    button.disabled = false
    button.textContent = 'Save'
  }
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return
  let submitting = false
  setFormValues(form, defaultValues)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    //prevent other submitssion
    if(submitting) return

    //show loading / disable button
    showLoading(form)
    submitting = true
    //console.log('form', form)
    //get form value
    const formValues = getFormValues(form)
    //console.log(formValues)
    formValues.id = defaultValues.id

    const isValid = await validatePostForm(form, formValues)
    //validation js
    if (!isValid) return

    //trigger submit callback
    await onSubmit?.(formValues)
    //otherwise, show validation errors
    hideLoading(form)
    submitting = false
  })
}
