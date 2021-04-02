import { writable, derived } from 'svelte/store'

let player = 'x'
let canMove = true

const getEmptyBoard = () => {
  return [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
}

function createBoard() {
  const { subscribe, set, update } = writable(getEmptyBoard())
  let empty = true

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

const getWinningSquares = ({board, direction, x = 0, y = 0}) => {
  let squares = []
  const boardLength = board.length
  for (let i = 0; i < boardLength; i++) {
    if (direction === 'diagonal' && x === 0) { //backslash
      squares.push({x: i, y: i})
    } else if (direction === 'diagonal') { //slash
      squares.push({x: i, y: boardLength - 1 - i})
    } else if (direction === 'horizontal') {
      squares.push({x: i, y})
    } else if (direction === 'vertical') {
      squares.push({x, y: i})
    }
  }
  return squares
}

const win = ({board, player, direction, x = 0, y = 0}) => {
  const winningSquares = getWinningSquares({
    board,
    x,
    y,
    direction
  })
  return {
    playing: false,
    winner: player,
    winningSquares
  }
}

const checkDiagonals = (board) => {
  const backslash = board.map((row, idx) => row[idx])
  let token = board[0][0]
  if (token && backslash.every(square => square === token)) {
    return win({board, player: token, direction: 'diagonal'})
  }

  const slash = board.map((row, idx) => row[row.length - 1 - idx])
  const rowSize = board[0].length
  token = board[0][rowSize - 1]
  if (token && slash.every(square => square === token)) {
    return win({board, player: token, x: rowSize - 1, direction: 'diagonal'})
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
          return win({board, player: token, x: j, direction: 'vertical'})
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
      return win({board, player: token, y: i, direction: 'horizontal'})
    }
  }
  return { player, playing: canMove }
}



export const board = createBoard()
export const status = derived(
  board,
  $board => getStatus($board)
)
