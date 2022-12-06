const heroSecondaryCanvas = document.querySelector('#hero-canvas-secondary')
const heroLowerCanvas = document.querySelector('#hero-canvas-lower-secondary')
const aboutSecondaryCanvas = document.querySelector('#about-canvas-secondary')
const storySecondaryCanvas = document.querySelector('#story-canvas-secondary')
const hsCTX = heroSecondaryCanvas.getContext('2d')
const hlCTX = heroLowerCanvas.getContext('2d')
const asCTX = aboutSecondaryCanvas.getContext('2d')
const ssCTX = storySecondaryCanvas.getContext('2d')


const secondaryCanvases = [
    [ heroSecondaryCanvas, hsCTX ], 
    [ heroLowerCanvas, hlCTX ],
    [ aboutSecondaryCanvas, asCTX ], 
    [ storySecondaryCanvas, ssCTX ],
]

secondaryCanvases.forEach(([ canvas, ctx ]) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight  
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
})







class SecondaryLines {

    constructor(segments, lineWidth, color, width, height) {
        this.color = color
        this.lineWidth = lineWidth

        // Generate pixel segments from percentages
        this.segments = segments.map(([ [x1, y1], [x2, y2] ]) => ([         // (x%, y%) => (x_px, y_px)
            [ (x1 / 100) * width, (y1 / 100) * height ],
            [ (x2 / 100) * width, (y2 / 100) * height ]
        ]))

        

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

    draw(ctx) {
        // For each point, we want to get the start and end coordinates from 
        // the segment, and then draw the line from (x1, y1) => (x2, y2)

        this.segments.forEach(([ [x1, y1], [x2, y2] ]) => {
            this.stateWrapper(ctx, {
                lineWidth: this.lineWidth, 
                strokeStyle : this.color 
            }, () => {

                ctx.moveTo(x1, y1)
                ctx.lineTo(x2, y2)
                ctx.stroke()

            })
        })
    }
}



// Get initialization values
const secondaryLineWidth = 20
const xAdjust_Secondary = (100 * secondaryLineWidth / secondaryCanvases[0][0].width) / 2       // For line widths
const yAdjust_Secondary = (100 * secondaryLineWidth / secondaryCanvases[0][0].height) / 2

const heroSegments = [
    [ [0, 80], [60, 80] ],
    [ [40, 80], [40, 100] ],
    [ [60, 92], [60, 50] ],
    [ [60, 60], [80, 60] ],
    [ [80 - xAdjust_Secondary, 60], [80 - xAdjust_Secondary, 100] ],

    [ [100, 84], [90, 84] ],
    [ [90, 84 + yAdjust_Secondary], [90, 48] ],
    [ [100, 48], [80, 48] ],

    [ [100, 36], [65, 36] ],
    [ [80, 36], [80, 15] ],
    [ [86, 15], [70, 15] ],

    [ [0, 10], [40 + xAdjust_Secondary, 10] ],
    [ [40, 10], [40, 24] ],
    [ [30, 24], [55 + xAdjust_Secondary, 24] ],
    [ [55, 24], [55, 0] ],
]


const lowerSegments = [
    [ [0, 75], [15, 75] ],
    [ [15, 50], [15, 90 + yAdjust_Secondary] ],
    [ [10, 90], [30, 90] ],
    [ [28, 90 + yAdjust_Secondary], [28, 50] ],

    [ [100, 98], [81, 98] ],
    [ [81, 98 + yAdjust_Secondary], [81, 57] ],
    [ [90, 57], [60, 57] ],
    [ [81, 80], [50, 80] ],
    [ [50, 50], [50, 90 + yAdjust_Secondary] ],
    [ [50, 90], [40, 90] ],

    [ [100, 15], [75, 15] ],
    [ [75, 15 + yAdjust_Secondary], [75, 0] ],
]


const storySegments = [
    [ [0, 55], [8, 55] ],
    [ [8, 8], [8, 70] ], 
    [ [100, 25], [92, 25] ],
    [ [ 92, 8], [92, 70] ],
]

const aboutSegments = [
    [ [0, 28], [23, 28] ],
    [ [23, 28 - yAdjust_Secondary], [23, 50] ],
    [ [16, 50], [48, 50] ],
    [ [45, 50], [45, 32] ],
    [ [10, 28], [10, 8 - yAdjust_Secondary] ],
    [ [10, 8], [40, 8] ],
    [ [40, 8 - yAdjust_Secondary], [40, 20] ],
    [ [33, 20], [57, 20] ],

    [ [0, 60], [3, 60] ],
    [ [3, 50], [3, 90 + yAdjust_Secondary] ],
    [ [3, 90], [12, 90] ],

    [ [100, 95], [81, 95] ],
    [ [81, 95 + yAdjust_Secondary], [81, 57] ],
    [ [90, 57], [60, 57] ],
    [ [81, 80], [50, 80] ],
    [ [50, 70], [50, 95 + yAdjust_Secondary] ],
    [ [50, 95], [40, 95] ],

    [ [100, 15], [75, 15] ],
    [ [75, 15 + yAdjust_Secondary], [75, 0] ],
]


new SecondaryLines(
    heroSegments, 
    secondaryLineWidth, 
    '#0D1D45', 
    secondaryCanvases[0][0].width, 
    secondaryCanvases[0][0].height
).draw(secondaryCanvases[0][1])

new SecondaryLines(
    lowerSegments, 
    secondaryLineWidth, 
    '#0D1D45', 
    secondaryCanvases[1][0].width, 
    secondaryCanvases[1][0].height
).draw(secondaryCanvases[1][1])

new SecondaryLines(
    aboutSegments, 
    secondaryLineWidth, 
    '#0D1D45', 
    secondaryCanvases[2][0].width, 
    secondaryCanvases[2][0].height
).draw(secondaryCanvases[2][1])

new SecondaryLines(
    storySegments, 
    secondaryLineWidth, 
    '#0D1D45', 
    secondaryCanvases[3][0].width, 
    secondaryCanvases[3][0].height
).draw(secondaryCanvases[3][1])


window.addEventListener('resize', () => {
    new SecondaryLines(
        heroSegments, 
        secondaryLineWidth, 
        '#0D1D45', 
        secondaryCanvases[0][0].width, 
        secondaryCanvases[0][0].height
    ).draw(secondaryCanvases[0][1])
    
    new SecondaryLines(
        lowerSegments, 
        secondaryLineWidth, 
        '#0D1D45', 
        secondaryCanvases[1][0].width, 
        secondaryCanvases[1][0].height
    ).draw(secondaryCanvases[1][1])
    
    new SecondaryLines(
        aboutSegments, 
        secondaryLineWidth, 
        '#0D1D45', 
        secondaryCanvases[2][0].width, 
        secondaryCanvases[2][0].height
    ).draw(secondaryCanvases[2][1])
    
    new SecondaryLines(
        storySegments, 
        secondaryLineWidth, 
        '#0D1D45', 
        secondaryCanvases[3][0].width, 
        secondaryCanvases[3][0].height
    ).draw(secondaryCanvases[3][1])
})