const header = document.querySelector('.header')
const content = document.querySelector('.content')

document.onscroll = function () {
    const scrollTop = document.documentElement.scrollTop
    if (scrollTop == 0) header.classList.remove('scroll')
    else header.classList.add('scroll')
}

const backgroundSetting = document.querySelector('.background-setting')
const modal = document.querySelector('.modal')
const close = document.querySelector('.modal-body-close')
const backgrounds = document.querySelectorAll('.modal-body-content-item')
const body = document.querySelector('body')
const backgroundArray = [
    { image: './assets/img/background1.png' },
    { image: './assets/img/background2.png' },
]

backgroundSetting.onclick = function () {
    modal.style.display = 'flex'
}

close.onclick = function () {
    modal.style.display = 'none'
}

backgrounds.forEach((background, index) => {
    background.onclick = function () {
        const backgroundIndex = backgroundArray[index].image
        removeActiveBackground()
        background.classList.add('active')
        body.style.backgroundImage = `url('${backgroundIndex}')`
        if (index == 0) {
            body.classList.remove('color')
            body.classList.add('dark')
        } else {
            body.classList.remove('dark')
            body.classList.add('color')
        }
    }
})

function removeActiveBackground() {
    backgrounds.forEach((background) => {
        background.classList.remove('active')
    })
}

const overlay = document.querySelector('.modal-overlay')
overlay.onclick = function () {
    modal.style.display = 'none'
}
