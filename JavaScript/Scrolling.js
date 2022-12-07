


// Handles all shift up animations
const shift = (elements, y) => {
    elements.forEach(element => {
        if (element.getBoundingClientRect().top - window.innerHeight <= y) {
            element.style.opacity = '1'
            element.style.transform = 'translate(0px)'
        }
    })
}


// -=-=-=- Nav Button Animations -=-=-=- //
const navButtons = document.querySelectorAll('.nav .link')
shift(navButtons, 10);


// -=-=-=- Hero Animations -=-=-=- //
const greeting = document.querySelectorAll('.hero .greeting')
shift(greeting, 10)

const myName = document.querySelectorAll('.hero .name')
shift(myName, 10)

const interests = document.querySelectorAll('.hero .interests')
shift(interests, 10)




// -=-=-=- Navbar -=-=-=- //
const navbar = document.querySelector('.mobile-header')
let prevScrollpos = window.scrollY;

window.addEventListener('scroll', e => {
    let currentScrollPos = window.scrollY
    
    if (window.scrollY <= 30) {
        navbar.className = 'mobile-header'
        return 
    }

    prevScrollpos > currentScrollPos
    ? navbar.className = 'mobile-header scroll-up'
    : navbar.className = 'mobile-header scroll-down'

    prevScrollpos = currentScrollPos
})





// -=-=-=- Scroll Buttons -=-=-=- //
const heroScroll = document.querySelector('#hero-scroll')
heroScroll.addEventListener('click', e => {
    document.querySelector('#projects').scrollIntoView({
        block: 'start', 
        behavior: 'smooth'
    })
})

const mobileHeroScroll = document.querySelector('#mobile-hero-scroll')
mobileHeroScroll.addEventListener('click', e => {
    document.querySelector('#projects').scrollIntoView({
        block: 'start', 
        behavior: 'smooth'
    })
})

const skillsScroll = document.querySelector('#skills-scroll')
skillsScroll.addEventListener('click', e => {
    document.querySelector('#about').scrollIntoView({
        block: 'start', 
        behavior: 'smooth'
    })
})






// -=-=-=- Projects Animation -=-=-=- //
const allProjects = document.querySelectorAll('.project')
shift(allProjects, -150)
document.addEventListener('scroll', () => shift(allProjects, -100))


const colorProjects = projects => {
    projects.forEach(project => {
        const diff = window.innerHeight - project.getBoundingClientRect().top
        const img = project.querySelector('img')

        300 < diff && diff < window.innerHeight + 100
        ? img.style.filter = 'grayscale(0%)'
        : img.style.filter = 'grayscale(100%)'
    })
}
const projects = document.querySelectorAll('#projects-section > .project')
document.addEventListener('scroll', () => colorProjects(projects))











// -=-=-=- Skills Animation -=-=-=- //
const backdrop = document.querySelector('#skills > .background')

// If the skills element is in the viewport, then we want to begin translating it
const shiftSkills = backdrop => {
    if (backdrop.getBoundingClientRect().top - window.innerHeight <= 0) {
        const adjust = ((window.innerHeight - backdrop.getBoundingClientRect().top) / 3 ) - (backdrop.offsetHeight / 4)
        backdrop.style.transform = `translateY(${adjust}px)`
    }
}
shiftSkills(backdrop)
document.addEventListener('scroll', () => shiftSkills(backdrop))


const skills = document.querySelector('#skills .foreground .items')
const showSkills = skills => {
    if (skills.getBoundingClientRect().top - window.innerHeight <= 0) {
        for (let i = 0; i < skills.children.length; i++) {
            const child = skills.children[i]
            child.style.opacity = 1
            child.style.transform = 'translateX(10px)'
        }
    }
}
document.addEventListener('scroll', () => showSkills(skills))


const skillsTitle = document.querySelector('#skills .foreground .title')
const illuminateTitle = title => {
    if (title.getBoundingClientRect().top - window.innerHeight <= -150) {
        title.style.color = '#414141'
    }
}
document.addEventListener('scroll', () => illuminateTitle(skillsTitle))







// -=-=-=- About Me Animation -=-=-=- //
const aboutCards = document.querySelectorAll('#about-section .section')
shift(aboutCards, -150)
document.addEventListener('scroll', () => shift(aboutCards, -150))




// -=-=-=- Story Animation -=-=-=- //
const story = document.querySelectorAll('#story .content > *')
shift(story, -150)
window.addEventListener('scroll', () => shift(story, -100))



// -=-=-=- Contact Animation -=-=-=- //
const columns = document.querySelectorAll('#contact .content > *')
shift(columns, -100)
window.addEventListener('scroll', () => shift(columns, -50))
