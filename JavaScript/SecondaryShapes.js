
const randomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}


class SecondarySquareCollection {

    constructor(color, count) {
        this.color = color 
        this.size = 30
        this.lineWidth = 4
        this.count = count 
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

    drawSquare(x, y, theta, ctx) {

        this.stateWrapper(ctx, {
            lineWidth: this.lineWidth, 
            strokeStyle: this.color
        }, () => {

            // Create the Square
            ctx.strokeRect(x, y, this.size, this.size)

            // Rotate the Square

        })


    }

    draw(ctx, canvas) {

        const w = canvas.width 
        const h = canvas.height 
        const step = h / this.count 
        let y = 0

        for (let i = 0; i < this.count; i++) {

            // Generate random x & theta
            const x = randomInt(0, w)
            const theta = randomInt(0, 360)

            // Draw the Square
            this.drawSquare(x, y, theta, ctx)

            // Increment y
            y += step
        }
    }


}