

const hamburger = document.querySelector('.mobile-nav')
const close = document.querySelector('.side-nav .close')
const sideNav = document.querySelector('.side-nav')
const links = document.querySelectorAll('.side-nav .link')
const app = document.querySelector('app')
const body = document.querySelector('body')
const html = document.querySelector('html')
const pages = [
    '#home', 
    '#projects', 
    '#skills', 
    '#about', 
    '#contact'
].map(page => document.querySelector(page))

hamburger.addEventListener('click', e => {
    sideNav.style.right = '0vw'
    body.style.height = '100vh'

    app.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    document.body.addEventListener('touchstart', e => {
        e.preventDefault()
    })
})

close.addEventListener('click', e => {
    sideNav.style.right = '-100vw'
    body.style.height = 'unset'

    app.style.overflow = 'scroll'
    body.style.overflow = 'scroll'
    document.body.addEventListener('touchstart', e => {})
})

links.forEach(link => {
    link.addEventListener('click', e => {
        const button = e.currentTarget
        const page = pages[button.getAttribute('data-index')]

        button.classList.add('clicked')

        setTimeout(() => {
            sideNav.style.right = '-100vw'
            page.scrollIntoView({
                block: 'start', 
                behavior: 'smooth'
            })  
        }, 200);

        setTimeout(() => {
            button.classList.remove('clicked')
        }, 400);

            
    })
})