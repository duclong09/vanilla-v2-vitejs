function showModal(modalElement) {
    if (!window.bootstrap) return
    const modal = new window.bootstrap.Modal(modalElement)
    if (modal) modal.show()
}

export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
    
    const modalElement = document.getElementById(modalId)
    if (!modalElement) return
    if(Boolean(modalElement.dataset.registered)) return
    //selectors
    const imageElement = modalElement.querySelector(imgSelector)
    const prevButton = modalElement.querySelector(prevSelector)
    const nextButton = modalElement.querySelector(nextSelector)

    if (!imageElement || !prevButton || !nextButton) return

    //lightbox vars
    let imgList = []
    let currentIndex = 0

    //determine index of selected img
    function showImageAtIndex(index) {
        imageElement.src = imgList[index].src
    }

    //hander click for all imgs -> Event delegation
    document.addEventListener('click', (event) => {
        //console.log('click', event.target)
        const { target } = event
        if (target.tagName !== 'IMG' || !target.dataset.album) return
        //img click -> find imgs with the same album / gallery
        imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
        currentIndex = [...imgList].findIndex((x) => x === target)
        //console.log('alnum image click', target,currentIndex, imgList)
        //show modal with selected img
        //show img index
        showImageAtIndex(currentIndex)
        //show modal
        showModal(modalElement)
    })

    //handle prev / next click
    prevButton.addEventListener('click', () => {
        //show prev image of current album
        currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
        showImageAtIndex(currentIndex)
    })

    nextButton.addEventListener('click', () => {
        //show next image of current album
        currentIndex = (currentIndex + 1) % imgList.length
        showImageAtIndex(currentIndex)
    })
    //mark this modal
    modalElement.dataset.registered = 'true'
}
