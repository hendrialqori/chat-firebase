const imageDisplay = (blobImageUrl: Blob) => {
    const container = document.querySelector('.displayImageContainer')
    const img = new Image()

    img.src=URL.createObjectURL(blobImageUrl)
    img.className='w-10 h-10 rounded-full'
    container?.appendChild(img)
}

export { imageDisplay }