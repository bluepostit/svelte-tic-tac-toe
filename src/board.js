import { writable, derived } from 'svelte/store'

const getEmptyBoard = () => {
  return [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
}

let player = 'x'
let canMove = true

function createBoard() {
  const { subscribe, set, update } = writable(getEmptyBoard())
  let empty = true
  let full = false

  const checkAllSquares = (board, callback) => {
    return board.every(row => {
      return row.every(square => callback(square))
    })
  }

  const isEmpty = (board) => checkAllSquares(board, s => s === '')
  const isFull = (board) => checkAllSquares(board, s => s !== '')

  subscribe(board => {
    empty = isEmpty(board)
    canMove = !isFull(board)
  })

  return {
    subscribe,
    move: (x, y, token) => update(board => {
      board[y][x] = token
      player = (token === 'x' ? 'o' : 'x')
      return board
    }),
    reset: () => {
      player = 'x'
      set(getEmptyBoard())
    },
    empty: () => empty,
  }
}

export const board = createBoard()

const win = ({player, x = 0, y = 0, isDiagonal = false}) => {
  return {
    playing: false,
    winner: player,
    x,
    y,
    isDiagonal
  }
}

const checkDiagonals = (board) => {
  const backslash = board.map((row, idx) => row[idx])
  let token = board[0][0]
  if (token && backslash.every(square => square === token)) {
    return win({player: token, isDiagonal: true})
  }

  const slash = board.map((row, idx) => row[row.length - 1 - idx])
  const rowSize = board[0].length
  token = board[0][rowSize - 1]
  if (token && slash.every(square => square === token)) {
    return win({ player: token, x: rowSize - 1, isDiagonal: true})
  }
}


const getStatus = (board) => {
  let status
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    let token
    if (i === 0) {
      // verticals
      for (let j = 0; j < row.length; j++) {
        token = row[j]
        const verticals = board.map(row => row[j])
        if (token && verticals.every(square => square === token)) {
          return win({player: token, x: j})
        }
      }

      // diagonals
      status = checkDiagonals(board)
      if (status) {
        return status
      }
    }

    // horizontals
    token = board[i][0]
    if (token && row.every(square => square === token)) {
      return win({player: token, y: i})
    }
  }
  return { player, playing: canMove }
}

export const status = derived(
  board,
  $board => getStatus($board)
)
