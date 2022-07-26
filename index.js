
// creates config for chessboardjs libary
let config = {
  draggable: true,
  position:'start'
}

// creates chess board with proper configuration(start pos)
let board = ChessBoard('board1',config);
// add event listener to reset the board
$('#restartBtn').on('click',board.start);


// add search btn
$('#searchBtn').on('click',function(){
  board.position($('#searchbar').val());
  $('#searchbar').val("");
});

// action listener for the addBtn id
$('#addBtn').on('click',function(){
  CrudManager.createFen($('#enterName').val(),$('#enterFen').val());
  $('#enterName').val("");
  $('#enterFen').val("");
});

// created a copy btn to get fen
$('#copyBtn').on('click',function(){
  let text = board.fen();
  navigator.clipboard.writeText(text).then(() => {
    console.log("copied");  
  });
});


class CrudManager {
  // crudcrud url
  static url = "5fa8a0e76d89420da73b7d5e63ad566c"; 

  // creates name to fens
  static createFen(name,fen){
    fetch('https://crudcrud.com/api/'+this.url+'/fens', {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: 'POST',
      body: JSON.stringify({
        name: name,
        fen: fen
      })

    })
    .then(response => response.json())
    .then(data =>{
      console.log(data)
      this.getTable()
    })
  }
  
  static getTable(){
    // Updates whole table
    
    $.ajax({
      url: 'https://crudcrud.com/api/'+this.url+'/fens',
      method: 'GET',
      dataType: "json",
      success: function(data){
        $('#table-body').empty();
        $(data).each(function(index, element){
          addRows(index,element);
        });
      }

    });
    
  }
  
  // deletes fen given the id
  static deleteFen(id){
    $.ajax({
      url: 'https://crudcrud.com/api/'+this.url+'/fens/'+id,
      method: 'DELETE',
      success: function(){
        console.log("DELETED");
        $('#table-body').fadeOut(200);
        CrudManager.getTable();
      },
      error: function(error){
        console.log(error);
      }
    })
  }

  static updateFen(id,name,fen){
    // updates fen given the ID
    fetch(
      'https://crudcrud.com/api/'+this.url+'/fens/'+id, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify({
          name: name,
          fen: fen
        })
      })
      .then(response => {
        this.getTable();
        console.log(response);
      })
  }

}

function addRows(a,b){
  // create rows everytime AJAX retrieves an element
  $('#table-body').fadeIn(1000);
  $('#table-body').html(
    $('#table-body').html()+
    `
      <tr id="${a}">
        <td class="index" value = ${b._id}>${a}</td>
        <td>${b.name}</td>
        <td>${b.fen}</td>

        <td>
          <button value="${b._id}+${b.fen}:${a}" type="button" class="btn btn-success">Play</button>
        </td>
        <td>
          <button value="${b._id}+${b.fen}:${a}" type="button" class="btn btn-secondary">Update</button>
        </td>
        <td>
          <button value="${b._id}+${b.fen}:${a}" type="button" class="btn btn-danger">Delete</button>
        </td>
      </tr>
    `);
    

}

// Updates Table 
CrudManager.getTable();


// wait til all is fetched
$(document).ajaxStop(function(){
  // add button listener
  const buttons = document.querySelectorAll('.btn')
  buttons.forEach(function(currentBtn){
    currentBtn.addEventListener('click', event=>{

      let element = event.target;

      // returns fen given a type of string: [row+fen:id]
      let fen = element.value.slice(element.value.indexOf("+")+1);
      fen = fen.slice(0,-2);
      // returns id 
      let id = element.value.substring(0,element.value.indexOf("+"))

      // return row #
      let row = element.value.slice(element.value.indexOf(":")+1);


      console.log("ROW:"+row);
      if(element.innerHTML=="Play"){
        // Edits boards position and adds FEN to searchbar
        $('#searchbar').val(fen);
        board.position($('#searchbar').val());

      } else if(element.innerHTML=="Delete"){
        // deletes fen
        CrudManager.deleteFen(id);
        
      } else{
        // Updates Table
        CrudManager.updateFen(id,$('#enterName').val(),$('#enterFen').val());
        $('#enterName').val("");
        $('#enterFen').val("");
      }

    });
  });
});

