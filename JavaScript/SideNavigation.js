

const hamburger = document.querySelector('.mobile-nav')
const close = document.querySelector('.side-nav .close')
const sideNav = document.querySelector('.side-nav')
const links = document.querySelectorAll('.side-nav .link')
const body = document.querySelector('body')
const pages = [
    '#home', 
    '#projects', 
    '#skills', 
    '#about', 
    '#contact'
].map(page => document.querySelector(page))

hamburger.addEventListener('click', e => {
    sideNav.style.right = '0vw'
    body.style.overflow = 'hidden'
})

close.addEventListener('click', e => {
    sideNav.style.right = '-100vw'
    body.style.overflow = 'scroll'
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