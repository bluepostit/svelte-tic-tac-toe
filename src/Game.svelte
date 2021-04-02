<script>
  import { board, status } from './board.js'
  import Square from './Square.svelte'

  const handleSquareClick = (event, row, col) => {
    const square = $board[row][col]
    if ($status.playing && !square) {
      const player = $status.player
      board.move(col, row, player)
    }
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
        on:click="{(e) => handleSquareClick(e, i, j)}" />
    {/each}
  {/each}
</div>
