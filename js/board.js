class Player {
    constructor(name) {
        this.name = name
        this.color = ''
    }
}

class Edge {
    constructor(p1, p2) {
        this.ends = [p1, p2]
        this.faces = []
        this.owner = null
    }
}

class Face {
    constructor() {
        this.edges = []
        this.owner = null
    }
}

class Board {
    constructor(pointWidth, pointHeight) {
        this.width = pointWidth
        this.height = pointHeight
        this.edgePool = {}
        this.initialized = false
    }

    getEdge(p1, p2) {
        if (!this.initialized) {
            if (!this.edgePool[p1])
                this.edgePool[p1] = {}
            if (!this.edgePool[p2])
                this.edgePool[p2] = {}

            if (!this.edgePool[p1][p2]) {
                var newEdge = new Edge(p1, p2)
                this.edgePool[p1][p2] = newEdge
                this.edgePool[p2][p1] = newEdge
            }
        }

        return this.edgePool[p1][p2]
    }

    // init board
    init() {
        for (var h = 0; h < this.height - 1; h++) {
            for (var w = 0; w < this.width - 1; w++) {
                var box = new Face();
                // layout ex:
                // a--b
                // |  |
                // d--c
                var a = (this.width * h) + w
                var b = a + 1
                var c = b + this.width
                var d = c - 1

                var ab = this.getEdge(a, b)
                box.edges.push(ab)
                ab.faces.push(box)

                var bc = this.getEdge(b, c)
                box.edges.push(bc)
                bc.faces.push(box)

                var cd = this.getEdge(c, d)
                box.edges.push(cd)
                cd.faces.push(box)

                var da = this.getEdge(d, a)
                box.edges.push(da)
                da.faces.push(box)
            }
        }
        this.initialized = true
    }

    play(edge, player) {
        if (edge && !edge.owner) {
            edge.owner = player
            debugLog(`${player.name} choose edge ${edge.ends}`)
            edge.faces.forEach(face => {
                if(face.edges.every(fEdge=> fEdge.owner)) {
                    face.owner = player
                    debugLog(`${player.name} wins box ${_.uniq(face.edges.flatMap(edge=>edge.ends))}`)
                }
            })
        }
    }
}