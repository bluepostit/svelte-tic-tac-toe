<script>
  import { board, status } from './board.js'
  import Square from './Square.svelte'

  // $: console.log($status)

  const handleSquareClick = (event, row, col) => {
    const square = $board[row][col]
    if ($status.playing && !square) {
      const player = $status.player
      board.move(col, row, player)
    }
  }

  const isWinningSquare = ({x, y}) => {
    let isWinning = false
    if ($status && $status.winningSquares) {
      isWinning = $status.winningSquares.find(square => {
        return square.x === x && square.y === y
      })
    }
    return !!isWinning
  }
</script>

<style>
  .board {
    width: 90%;
    padding-bottom: 1em;
    align-self: center;
  }
</style>

<div class="board">
  {#each $board as row, i}
    {#each row as square, j}
      <Square
        content="{square}"
        <!-- pass in $board to trigger Svelte to re-render -->
        winning="{isWinningSquare({x: j, y: i}, $board)}"
        on:click="{(e) => handleSquareClick(e, i, j)}" />
    {/each}
  {/each}
</div>
