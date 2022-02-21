import { setBackgroundImage, setTextContent } from './common'
import { setFieldValue } from './common'
import * as yup from 'yup'
import { randomNumber } from '.'
const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

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

  //v2: using form data

  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}

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
    description: yup
      .string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (value) => Boolean(value?.name)),
    }),
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
  try {
    //reset previous errors
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))
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

function showLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving...'
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return
  randomButton.addEventListener('click', () => {
    //random id
    //build url
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`
    //set imgUrl input + background
    setFieldValue(form, '[name="imageUrl"]', imageUrl)
    setBackgroundImage(document, '#postHeroImage', imageUrl)
  })
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value))
  })
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]')
  if (!uploadImage) return

  uploadImage.addEventListener('change', (event) => {
    console.log('selected file', event.target.files[0])
    //get selected file
    const file = event.target.files[0]
    if (file) {
      //preview
      const imageUrl = URL.createObjectURL(file)
      setBackgroundImage(document, '#postHeroImage', imageUrl)
    }
  })
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false
  setFormValues(form, defaultValues)

  //init Event
  initRandomImage(form)
  initRadioImageSource(form)
  initUploadImage(form)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    //prevent other submitssion
    if (submitting) return

    //show loading / disable button
    showLoading(form)
    submitting = true
    //console.log('form', form)
    //get form value
    const formValues = getFormValues(form)
    console.log(formValues)
    //console.log(formValues)
    formValues.id = defaultValues.id

    const isValid = await validatePostForm(form, formValues)
    //validation js
    if (isValid) await onSubmit?.(formValues)

    //trigger submit callback

    //otherwise, show validation errors
    hideLoading(form)
    submitting = false
  })
}
