
class Screen {
    constructor(canvas) {
        this.canvas = canvas
    }

    getCtx() {
        return this.canvas.getContext('2d')
    }

    draw(board) {
        const ctx = this.getCtx()
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var toVisit = [0]
        var alreadyDrawn = []
        while (toVisit.length > 0) {
            // draw current point
            var p = toVisit.shift()
            var sp = this.mapPointToScreen(p, board)
            this.drawPoint(sp)
            alreadyDrawn.push(p)

            // queue next points
            var endpoints = Object.keys(board.edgePool[p])

            endpoints.forEach(endP => {
                const edge = board.edgePool[p][endP]
                if (alreadyDrawn.indexOf(edge) < 0) {
                    var spA = sp
                    var spB = this.mapPointToScreen(endP, board)
                    this.drawEdge(spA, spB, edge.owner)
                    alreadyDrawn.push(edge)
                }
                if (alreadyDrawn.indexOf(endP) < 0 && toVisit.indexOf(endP) < 0) {
                    // if not processed or queued, queue it endpoint
                    toVisit.push(endP)
                }
            })
        }
    }

    drawPoint(sp) {
        const ctx = this.getCtx()
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 5, 0, Math.PI * 2, false);
        ctx.fillStyle = "#D0D0D0";
        ctx.fill();
        ctx.closePath();
    }

    drawEdge(spA, spB, owner) {
        const ctx = this.getCtx()
        ctx.beginPath()
        ctx.moveTo(spA.x, spA.y)
        ctx.strokeStyle = owner ? "#000000" : "#D0D0D0";
        ctx.lineWidth = LINE_WIDTH;
        ctx.lineTo(spB.x, spB.y)
        ctx.stroke()
        ctx.closePath()
    }

    mapPointToScreen(point, board) {
        const ctx = this.getCtx()

        // factors represent location as a scale
        const xFactor = (point % board.width) / board.width
        const yFactor = (Math.trunc(point / board.width)) / board.height

        const boxSize = this.getBoxSize(board)
        return {
            x: this.canvas.clientWidth * xFactor + boxSize.x / 2,
            y: this.canvas.clientHeight * yFactor + boxSize.y / 2
        }
    }

    getBoxSize(board) {
        const clientWidth = this.canvas.clientWidth
        const clientHeight = this.canvas.clientHeight
        return {
            x: clientWidth / board.width,
            y: clientHeight / board.height
        }
    }

    getScreenMargin(boxSize) {
        return {
            x: boxSize.x / 2,
            y: boxSize.y / 2
        }
    }

    mapScreenToEdge(sp, board) {
        const boxSize = this.getBoxSize(board)
        const margin = this.getScreenMargin(boxSize)

        // factors represent a percentage in board coordinates
        const xFactor = (sp.x - margin.x) / (this.canvas.clientWidth - boxSize.x)
        const yFactor = (sp.y - margin.y) / (this.canvas.clientHeight - boxSize.y)
        console.log("xFactor:" + xFactor + " yFactor:" + yFactor)

        // ratios are the scaled board coordinate
        const xRatio = xFactor * (board.width - 1), yRatio = yFactor * (board.height - 1)
        console.log("Ratio: " + xRatio + ", " + yRatio)

        // round is the nearest actual coordinate
        const xRound = Math.round(xRatio), yRound = Math.round(yRatio)
        console.log("Rounded: " + xRound + ", " + yRound)

        var p1, p2
        // check if mouse is closer to a horizontal or vertical edge, then translate to edge endpoints.
        console.log("x: " + Math.abs(xRound - xRatio) + " vs y: " + Math.abs(yRound - yRatio))
        if (Math.abs(yRound - yRatio) < Math.abs(xRound - xRatio)) {
            p1 = yRound * board.width + Math.floor(xRatio)
            p2 = p1 + 1
        } else {
            p1 = Math.floor(yRatio) * board.width + xRound
            p2 = p1 + board.width
        }
        // with the endpoints, the edge obj can be pulled from the edge pool
        return board.getEdge(p1, p2)
    }
}