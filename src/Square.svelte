<script>
  export let content = ''
  export let winning = false
</script>

<style>
  .square {
    float: left;
    position: relative;
    width: 29%;
    border: 0.1em #8e8e8e solid;
    padding-bottom: 29%;
    margin: 0.5%;
    overflow:hidden;
    background-color: beige;
  }

  .square .content {
    position: absolute;
    height: 80%;
    width: 90%;
    padding: 10% 5%;
    font-size: 3em;
  }

  .square .table {
    display: table;
    height: 100%;
    width: 100%;
  }

  .square .table .table-cell {
    display: table-cell;
    vertical-align: middle;
    height: 100%;
    width: 100%;
  }

  .square.winning {
    color: orangered;
  }

</style>

<div class="square" on:click class:winning>
  <div class="content">
    <div class="table">
      <div class="table-cell">
        {content}
      </div>
    </div>
  </div>
</div>
