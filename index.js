let config = {
  draggable: true,
  position:'start'
}
let board = ChessBoard('board1',config);

$('#restartBtn').on('click',board.start);

searchBtn.addEventListener("click",function(){
  board.position($('#searchbar').val());
});




let index =0;
let fenArr=[];
function addPosition(name,fen){
  let temp=`<option id="b${index}"class="dropdown-item" value = ${index} onclick="changeText(${index})" > ${name} </option>`;
  $('#dropdownpos').append(temp);
  fenArr[index]=fen;
  index++;

}
addPosition("Italian Game","r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3");
addPosition("Ruy Lopez","r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3");
addPosition("Sicilian Defense","rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3");

function changeText(x){
  console.log(x);
  $('#searchbar').val(fenArr[x]);  
}


