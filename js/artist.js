class Artist {
    constructor(ctx) {
        this.ctx = ctx
    }

    drawFace(color, loc, boxSize) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(loc.x, loc.y, boxSize.x, boxSize.y)
    }

    drawEdge(spA, spB, owner) {
        this.ctx.beginPath()
        this.ctx.moveTo(spA.x, spA.y)
        this.ctx.strokeStyle = owner ? "#000000" : "#D0D0D0";
        this.ctx.lineWidth = LINE_WIDTH;
        this.ctx.lineTo(spB.x, spB.y)
        this.ctx.stroke()
        this.ctx.closePath()
    }

    drawPoint(sp, owned) {
        this.ctx.beginPath();
        this.ctx.arc(sp.x, sp.y, 5, 0, Math.PI * 2, false);
        this.ctx.fillStyle = owned ? 'black' : "#D0D0D0";
        this.ctx.fill();
        this.ctx.closePath();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}