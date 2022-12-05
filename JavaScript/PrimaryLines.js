const heroBlueCanvas    = document.querySelector('#hero-canvas-blue')
const heroLimeCanvas    = document.querySelector('#hero-canvas-lime')
const heroPurpleCanvas  = document.querySelector('#hero-canvas-purple')
const heroCanvasLower   = document.querySelector('#hero-canvas-lower')
const aboutBlueCanvas    = document.querySelector('#about-canvas-blue')
const aboutLimeCanvas    = document.querySelector('#about-canvas-lime')
const aboutPurpleCanvas  = document.querySelector('#about-canvas-purple')
const contactBlueCanvas    = document.querySelector('#contact-canvas-blue')
const contactLimeCanvas    = document.querySelector('#contact-canvas-lime')
const contactPurpleCanvas  = document.querySelector('#contact-canvas-purple')

const hbCTX = heroBlueCanvas.getContext('2d')
const hlCTX = heroLimeCanvas.getContext('2d')
const hpCTX = heroPurpleCanvas.getContext('2d')
const hcCTX = heroCanvasLower.getContext('2d')
const abCTX = aboutBlueCanvas.getContext('2d')
const alCTX = aboutLimeCanvas.getContext('2d')
const apCTX = aboutPurpleCanvas.getContext('2d')
const cbCTX = contactBlueCanvas.getContext('2d')
const clCTX = contactLimeCanvas.getContext('2d')
const cpCTX = contactPurpleCanvas.getContext('2d')

const heroCanvases = [
    [ heroBlueCanvas, hbCTX ], 
    [ heroLimeCanvas, hlCTX ], 
    [ heroPurpleCanvas, hpCTX ],
].forEach(([ canvas, ctx ]) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight  
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
})

const aboutCanvases = [
    [ aboutBlueCanvas, abCTX ], 
    [ aboutLimeCanvas, alCTX ], 
    [ aboutPurpleCanvas, apCTX ],
].forEach(([ canvas, ctx ]) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight  
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
})

const contactCanvaes = [
    [ contactBlueCanvas, cbCTX ], 
    [ contactLimeCanvas, clCTX ], 
    [ contactPurpleCanvas, cpCTX ],
].forEach(([ canvas, ctx ]) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight  
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
})

const heroLowerCanaves = [
    [ heroCanvasLower, hcCTX ],
].forEach(([ canvas, ctx ]) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight  
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
})









class Node {
    constructor(segment) {
        this.segment = segment 
        this.children = []
    }

    appendChild(node) {
        this.children.push(node)
    }
}



class PrimaryLine {

    constructor(head, lineWidth, color, width, height, step, finishFunc) {
        this.strokeStyle = color
        this.lineWidth = lineWidth
        this.shadowBlur = 20
        this.shadowColor = color
        this.finishFunc = finishFunc || null

        this.progress = 0
        this.completeSegments = 0
        this.totalSegments = 0
        this.step = step || 40

        this.head = head

        // Generate pixel segments from percentage segments (x%, y%) => (x_px, y_px)
        this.BFS(
            this.head, 
            node => {
                const [ [x1, y1], [x2, y2] ] = node.segment
                node.segment = [ 
                    [ (x1 / 100) * width, (y1 / 100) * height ],
                    [ (x2 / 100) * width, (y2 / 100) * height ]
                ]
                this.totalSegments++
            }, 
            child => true
        )

    }

    stateWrapper(ctx, params, func) {
        /* stateWrapper provides an isolated place to draw something without affecting other styles */

        ctx.save()

        // Init the parameters & execute the function
        Object.entries(params).forEach(([key, val]) => ctx[key] = val) 

        // Execute the function
        ctx.beginPath()
        const ret = func()
        ctx.closePath()

        ctx.restore()
        
        return ret
    }

    doneDrawing() {
        return this.completeSegments === this.totalSegments
    }

    BFS(head, func, validChild) {

        const queue = [ head ]
    
        while (queue.length > 0) {
            const node = queue.shift()
            func(node)
            node.children.forEach(child => {
                if (validChild) queue.push(child)
            })
        }
    }

    update(ctx) {
        this.completeSegments = 0
        this.progress += this.step

        this.draw(ctx)
    }

    draw(ctx) {

        let traversed = 0
        let maxChildDist = -1
        const queue = [this.head, null] 


        while (queue.length > 1 || queue[0]) {

            // -=-=- Get the node -=-=- //
            const node = queue.shift() 


            // -=-=- Perform operation on node -=-=- //
            if (!node) {    
                traversed += maxChildDist
                maxChildDist = -1
                queue.push(null)
                continue
            }


            let [ [x1, y1], [x2, y2] ] = node.segment
            const diffs = [ x2 - x1, y2 - y1 ]
            const remaining = this.progress - traversed

            const [ xAbsDiff, yAbsDiff ]    = diffs.map(Math.abs)
            const [ xDir, yDir ]            = diffs.map(Math.sign)

            const X2 = xAbsDiff === 0 || xAbsDiff < remaining ? x2 : x1 + (xDir * remaining)
            const Y2 = yAbsDiff === 0 || yAbsDiff < remaining ? y2 : y1 + (yDir * remaining)

            // Draw the line
            this.stateWrapper(ctx, {
                lineWidth: this.lineWidth, 
                strokeStyle: this.strokeStyle,
                shadowBlur: this.shadowBlur, 
                shadowColor: this.shadowColor
            }, () => {
                ctx.moveTo(x1, y1)
                ctx.lineTo(X2, Y2)
                ctx.stroke()
            })

            // Check if complete segment
            if (X2 === x2 && Y2 === y2) this.completeSegments++


            // Update the maximum traversed distance for this level
            maxChildDist = Math.max(maxChildDist, Math.max(xAbsDiff, yAbsDiff))


            // -=-=- Enqueue children if valid -=-=- //
            const validChild = (xAbsDiff !== 0 && xAbsDiff < remaining) 
                            || (yAbsDiff !== 0 && yAbsDiff < remaining) 

            if (validChild) node.children.forEach(child => queue.push(child))
        }
    }

    




    animate(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.update(ctx)
        if (this.doneDrawing()) {
            if (this.finishFunc) this.finishFunc()
            return
        }

        requestAnimationFrame(this.animate.bind(this, ctx, canvas))
    }

    
}











const heroLineWidth = 30
const xAdjust_Primary = (100 * heroLineWidth / heroBlueCanvas.width) / 2       // For line widths
const yAdjust_Primary = (100 * heroLineWidth / heroBlueCanvas.height) / 2
const colors = ['#0066FF', '#00FFB2', '#B414FF']
let blueLineComplete = false



const heroSegments = [
    [
        [ [100, 35], [72 - xAdjust_Primary, 35] ],
        [ [72, 35], [72, 0] ],
    ],
    [
        [ [100, 65], [63 - xAdjust_Primary, 65] ],
        [ [63, 65], [63, 100] ],
    ],
    [
        [ [100, 10], [85 - xAdjust_Primary, 10] ],
        [ [85, 10], [85, 100] ],
    ],
].map(segments => segments.map(s => new Node(s)))


heroSegments[0][0].children = [ heroSegments[0][1] ]
heroSegments[1][0].children = [ heroSegments[1][1] ]
heroSegments[2][0].children = [ heroSegments[2][1] ]

const heroLines = heroSegments.map((segments, i) => new PrimaryLine(
    segments[0], 
    heroLineWidth, 
    colors[i], 
    heroBlueCanvas.width, 
    heroBlueCanvas.height
))

heroLines[0].finishFunc = () => {
    blueLineComplete = true 
    if (window.scrollY > 0) {
        lowerLines[0].animate(hcCTX, heroCanvasLower)
        window.removeEventListener('scroll', drawLowerLine)
    }
}

const heroDelay = 2000
setTimeout(() => {
    heroLines[2].animate(hpCTX, heroPurpleCanvas)
}, 300 + heroDelay);

setTimeout(() => {
    heroLines[1].animate(hlCTX, heroLimeCanvas)
}, 600 + heroDelay);

setTimeout(() => {
    heroLines[0].animate(hbCTX, heroBlueCanvas)
}, 900 + heroDelay);







const lowerLineWidth = 30
const lowerPadding = (100 * lowerLineWidth / heroCanvasLower.height) / 2

const lowerSegments = [
    [
        [ [72, 100], [72, 80 - lowerPadding] ],
        [ [72, 80], [0, 80] ],
    ],
].map(segments => segments.map(s => new Node(s)))

lowerSegments[0][0].children = [ lowerSegments[0][1] ]

const lowerLines = lowerSegments.map((segments, i) => new PrimaryLine(
    segments[0], 
    lowerLineWidth, 
    colors[i], 
    heroCanvasLower.width, 
    heroCanvasLower.height,
))

const drawLowerLine = () => {
    if (window.scrollY > 0 && blueLineComplete) {
        lowerLines[0].animate(hcCTX, heroCanvasLower)
        window.removeEventListener('scroll', drawLowerLine)
    }
}
drawLowerLine()
window.addEventListener('scroll', drawLowerLine)













const aboutLineWidth = 20
const aboutPadding = (100 * aboutLineWidth / aboutBlueCanvas.height) / 2

const aboutSegments =  [
    [
        [ [100, 22], [85, 22] ], 

        [ [85, 22], [85, 30] ], 
        [ [85, 25], [85, 15] ], 
        [ [85, 15], [45, 15] ], 

        [ [85, 15], [85, 0] ], 
    ], 
    [
        [ [100, 95], [90, 95] ], 
        [ [90, 95 + aboutPadding], [90, 70] ], 
        [ [90, 70], [70, 70] ], 
        [ [90, 70], [100, 70] ], 
    ], 
    [
        [ [0, 35], [6, 35] ], 
        [ [6, 35], [6, 25] ], 
        [ [6, 35], [6, 48 + aboutPadding] ], 
        [ [6, 48], [30, 48] ], 
    ], 
].map(segments => segments.map(s => new Node(s)))

aboutSegments[0][0].children = [ aboutSegments[0][1], aboutSegments[0][2] ]
aboutSegments[0][2].children = [ aboutSegments[0][3], aboutSegments[0][4] ]

aboutSegments[1][0].children = [ aboutSegments[1][1] ]
aboutSegments[1][1].children = [ aboutSegments[1][2], aboutSegments[1][3] ]

aboutSegments[2][0].children = [ aboutSegments[2][1], aboutSegments[2][2] ]
aboutSegments[2][2].children = [ aboutSegments[2][3] ]


const aboutLines = aboutSegments.map((segments, i) => new PrimaryLine(
    segments[0], 
    aboutLineWidth, 
    colors[i], 
    aboutBlueCanvas.width, 
    aboutBlueCanvas.height, 
    10
))

const about = document.querySelector('#about')

const drawLime = () => {
    if (about.getBoundingClientRect().top - window.innerHeight <= 0) {
        setTimeout(() => {
            aboutLines[1].animate(abCTX, aboutBlueCanvas)
        }, 800);
        window.removeEventListener('scroll', drawLime)
    }
}

const drawPurple = () => {
    if (about.getBoundingClientRect().top - window.innerHeight <= -300) {
        setTimeout(() => {
            aboutLines[2].animate(alCTX, aboutLimeCanvas)
        }, 1300);
        window.removeEventListener('scroll', drawPurple)
    }
    
}

const drawBlue = () => {
    if (about.getBoundingClientRect().top - window.innerHeight <= -400) {
        setTimeout(() => {
            aboutLines[0].animate(apCTX, aboutPurpleCanvas)
        }, 1800);
        window.removeEventListener('scroll', drawBlue)
    }
    
}



drawLime()
drawPurple()
drawBlue()
window.addEventListener('scroll', drawLime)
window.addEventListener('scroll', drawPurple)
window.addEventListener('scroll', drawBlue)







const contactLineWidth = 20 
const contactPadding = (100 * aboutLineWidth / aboutBlueCanvas.height) / 2
const contactColors = ['#0066FF', '#B414FF', '#00FFB2' ]


const contactSegments = [
    [
        [ [8, 0], [8, 18] ],
    ], 
    [
        [ [100, 85], [85, 85] ],
    ], 
    [
        [ [100, 18], [92, 18] ],
        [ [92, 18 + contactPadding], [92, 0] ],
    ]
].map(segments => segments.map(s => new Node(s)))

contactSegments[2][0].children = [ contactSegments[2][1] ]



const contactLines = contactSegments.map((segments, i) => new PrimaryLine(
    segments[0],
    contactLineWidth, 
    contactColors[i], 
    contactBlueCanvas.width,
    contactBlueCanvas.height,
    15
))



const contact = document.querySelector('#contact')

const contactAnimations = {
    drawLime: () => {
        console.log()
        if (contact.getBoundingClientRect().top - window.innerHeight <= -100) {
            setTimeout(() => {
                contactLines[1].animate(clCTX, contactLimeCanvas)
            }, 800);
            window.removeEventListener('scroll', contactAnimations.drawLime)
        }
    }, 
    drawPurple: () => {
        if (contact.getBoundingClientRect().top - window.innerHeight <= -100) {
            setTimeout(() => {
                contactLines[2].animate(cpCTX, contactPurpleCanvas)
            }, 1000);
            window.removeEventListener('scroll', contactAnimations.drawPurple)
        }
    },
    drawBlue: () => {
        if (contact.getBoundingClientRect().top - window.innerHeight <= -100) {
            setTimeout(() => {
                contactLines[0].animate(cbCTX, contactBlueCanvas)
            }, 1300);
            window.removeEventListener('scroll', contactAnimations.drawBlue)
        }
    }
}


Object.values(contactAnimations).forEach(animate => {
    animate()
    window.addEventListener('scroll', animate)
})









