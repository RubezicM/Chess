var selectedPiece = "",
  plannedMove = "",
  playerTurn = "white",
  gameStarted = false,
  numberOfMoves = 0,
  selectedField;


function nacrtajTabelu() {
  var html = '<table id="sahTabla">';
  for (var i = 0; i < table.length; i++) {
    var fieldIndex = convertField(i);
    if (i % 8 == 0) {
      html += "<tr>";
    }
    if (Object.keys(table[i]).length > 0) {
      var color = table[i].color;
      var piece = table[i].piece;
      html += `<td id="polje_${i}">${
        pieces[piece][color]
      }<span class="field-id">${fieldIndex}</span></td>`; // {  "color": "black",   "piece": "rook" }
    } else {
      html += `<td id="polje_${i}"><span class="field-id">${fieldIndex}</span></td>`;
    }
    if (i % 8 == 7) {
      html += "</tr>\n\n";
    }
  }
  html += "</table>";
  document.getElementById("table").innerHTML = html;
}

nacrtajTabelu();

document.getElementById("table").addEventListener("click", function(event) {
  var field = event.target;
  var id = field.id.slice(6);
  
  if (selectedPiece == "") {
    if (!table[id].color) {
      return false;
    }
    selectedPiece = id;
    selectedField = table[selectedPiece];
    selectedField.id = id;
    console.log(selectedField);
    
    
  } else {
    plannedMove = id;
    if (isValidMove(selectedPiece, plannedMove)) {
      table[plannedMove] = table[selectedPiece];
      table[selectedPiece] = {};
      selectedPiece = "";
      playerTurn = playerTurn == "white" ? "black" : "white";
      numberOfMoves++;
    } else {
      selectedPiece = "";
    }
  }
  nacrtajTabelu();
  if (selectedPiece != "")
    document.getElementById("polje_" + id).style.background = "pink";
});

function isValidMove(firstSelection, secondSelection) {
  var move = {
    firstSelection: {
      id: firstSelection, // id number
      color: table[firstSelection].color,
      piece: table[firstSelection].piece
    },
    secondSelection: {
      id: secondSelection, // id number
      color: table[secondSelection].color,
      piece: table[secondSelection].piece
    }
  };
  console.log(
    "First Selection: ",
    firstSelection,
    table[firstSelection],
    "\n",
    "Second Selection: ",
    secondSelection,
    table[secondSelection],
    "ACTIVE PLAYER :",
    playerTurn,
    move.firstSelection.color == playerTurn
  );

  if (
    firstSelection === secondSelection ||
    move.firstSelection.color == move.secondSelection.color ||
    move.firstSelection.color != playerTurn
  ) {
    return false;
  }

  if (table[firstSelection].piece == "rook") {
    return isValidMoveRook(move.firstSelection, move.secondSelection);
  } else if (table[firstSelection].piece == "bishop") {
    return isValidMoveBishop(move.firstSelection, move.secondSelection);
  } else if (table[firstSelection].piece == "knight") {
    return isValidMoveKnight(move.firstSelection, move.secondSelection);
  } else if (table[firstSelection].piece == "pawn") {
    return isValidMovePawn(move.firstSelection, move.secondSelection);
  } else if (table[firstSelection].piece == "queen") {
    return isValidMoveQueen(move.firstSelection, move.secondSelection);
  }
}

function isValidMoveRook(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  var field1 = convertField(firstSelection.id);
  var field2 = convertField(secondSelection.id);
  console.log("field1:", field1, "field2:", field2);
  showPossibleMoves();
  return field1[0] == field2[0] || field1[1] == field2[1];
}
// function showPossibleMoves("rook"){
  
// }

function isValidMoveBishop(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  var field1 = convertField(firstSelection.id);
  var field2 = convertField(secondSelection.id);
  console.log("field1:", field1, "field2:", field2);
  return (
    field1[0] - field2[0] == field1[1] - field2[1] ||
    field1[0] - field2[0] == field2[1] - field1[1]
  );
}
function isValidMoveKnight(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  var field1 = convertField(firstSelection.id);
  var field2 = convertField(secondSelection.id);
  console.log("field1:", field1, "field2:", field2);
  return (
    (field1[0] + 2 == field2[0] ||
      field1[0] - 2 == field2[0] ||
      field1[1] + 2 == field2[1] ||
      field1[1] - 2 == field2[1]) &&
    (field1[1] + 1 == field2[1] ||
      field1[1] - 1 == field2[1] ||
      field1[0] + 1 == field2[0] ||
      field1[0] - 1 == field2[0])
  );
}
function getSurroundingFields(type) {
  field1[0] - field2[0] == field1[1] - field2[1] ||
    field1[0] - field2[0] == field2[1] - field1[1];
}

function isValidMovePawn(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  var field1 = convertField(firstSelection.id);
  var field2 = convertField(secondSelection.id);

  // TO-DO first move condition - can go 2 fields
  // Eating condition
  console.log("field1:", field1, "field2:", field2);
  console.log(secondSelection.id);

  if (secondSelection.piece != undefined) {
    return false;
  }
  if (numberOfMoves < 2) {
    if (firstSelection.color == "white") {
      return (
        (field1[0] - 1 == field2[0] || field1[0] - 2 == field2[0]) &&
        field1[1] == field2[1]
      );
    } else {
      return (
        (field1[0] + 1 == field2[0] || field1[0] + 2 == field2[0]) &&
        field1[1] == field2[1]
      );
    }
  } else {
    if (firstSelection.color == "white") {
      return field1[0] - 1 == field2[0] && field1[1] == field2[1];
    } else {
      // selection color black
      return field1[0] + 1 == field2[0] && field1[1] == field2[1];
    }
  }
}
function isValidMoveQueen(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  var field1 = convertField(firstSelection.id);
  var field2 = convertField(secondSelection.id);
  console.log("field1:", field1, "field2:", field2);
  console.log(secondSelection.id);
  console.log(
    isValidMoveBishop(firstSelection, secondSelection) ||
      isValidMoveRook(firstSelection, secondSelection)
  );

  return (
    isValidMoveBishop(firstSelection, secondSelection) ||
    isValidMoveRook(firstSelection, secondSelection)
  );
}

function convertField(id) {
  return [Math.floor(id / 8), id % 8];
}
function calcFieldIndex(typeOfFigure, fields) {
  var tmpArr = [];
  if (typeOfFigure == "pawn") {
    for (var i = 0; i < fields.length; i++) {
      for (var y = 0; y < fields[i].length; y++) {}
    }
  }
}

function isClearPath(pos) {}
function getCurrentPosition() {}
