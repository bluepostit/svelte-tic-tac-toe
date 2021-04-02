<script>
  import { board, status } from './board.js'
  import Game from './Game.svelte'
</script>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
	}

	h1 {
		text-transform: uppercase;
		font-size: 2em;
	}

  .status {
    font-size: 1.5em;
  }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<main>
	<h1>Tic Tac Toe</h1>
  <Game />
  {#if $status}
    <div class="status">
      {#if $status.playing}
        <strong>{$status.player}</strong> to move
      {:else if $status.winner}
        <strong>{$status.winner}</strong> wins!
      {:else}
        <strong>No more moves!</strong>
      {/if}
    </div>
    {#if !$status.playing}
      <div><button on:click="{board.reset}">New game</button></div>
    {/if}
  {/if}
</main>
