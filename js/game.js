class Game {

    constructor(canvas, playerNum, gameSize) {
        const COLORS = ['red', 'green', 'blue', 'yellow']
        this.canvas = canvas

        this.players = []
        for (let idx = 0; idx < playerNum; idx++) {
            const player = new Player('Player ' + idx)
            player.color = COLORS[idx % COLORS.length]
            this.players.push(player)
        }

        this.board = new Board(gameSize.width, gameSize.height)
        this.board.init()

        this.screen = new Screen(this.canvas);

        this.currentPlayerIdx = 0

        this.screen.draw(this.board)
    }

    get currentPlayer() {
        return this.players[this.currentPlayerIdx]
    }

    changePlayer() {
        this.currentPlayerIdx = ++this.currentPlayerIdx % this.players.length
    }

    makeMove(evt) {
        this.screen.selectEdge(evt, this.currentPlayer, this.board)
        this.changePlayer()
    }
}