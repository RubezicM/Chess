var selectedPiece = "",
  plannedMove = "",
  playerTurn = "white",
  gameStarted = false,
  numberOfMoves = 0,
  selectedField;
  // Move constructor

  function Move(id){
    this.id = id;
    this.color = table[id].color;
    this.piece = table[id].piece;
  }
  let firstSelection,
      secondSelection;
  // var kme = {
  //   firstSelection: {
  //     id: "", // id number
  //     color: "",
  //     piece: ""
  //   },
  //   secondSelection: {
  //     id: "", // id number
  //     color: "",
  //     piece: ""
  //   }
  // };

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
      }<span class="field-convert">${fieldIndex}</span><span class="field-id">ID: ${i}</span></td>`; // {  "color": "black",   "piece": "rook" }
    } else {
      html += `<td id="polje_${i}"><span class="field-convert">${fieldIndex}</span><span class="field-id">ID: ${i}</span></td>`;
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
    selectedPiece = Number(id);
    selectedField = table[selectedPiece];
    selectedField.id = id;
    console.log(selectedField);
  } else {
    plannedMove = id;
    if (isValidMove(selectedPiece, plannedMove)) {
      console.log("pomeraj");

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
      id: Number(firstSelection), // id number
      color: table[firstSelection].color,
      piece: table[firstSelection].piece
    },
    secondSelection: {
      id: Number(secondSelection), // id number
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
  // console.log(firstSelection, secondSelection);
  // var field1 = convertField(firstSelection.id);
  // var field2 = convertField(secondSelection.id);
  var posibleMoves = {
    white: {
      canMove: firstSelection.id - 8,
      canEat: [firstSelection.id - 9, firstSelection.id - 7]
    },
    black: {
      canMove: firstSelection.id + 8,
      canEat: [firstSelection.id + 9, firstSelection.id + 7]
    }
  };
  var canEat = posibleMoves[playerTurn]["canEat"].indexOf(secondSelection.id) >= 0;
  // console.log("Eat : ", eat);

  // Eating condition
  //console.log("field1:", field1, "field2:", field2);
  console.log(
    "firstSelection.id: ",
    firstSelection.id,
    "\n",
    "secondSelection.id: ",
    secondSelection.id,
    "\n",
    "posibleMoves -- id",
    posibleMoves[playerTurn]["canMove"],
    "\n",
    "canEat array :",
    posibleMoves[playerTurn]["canEat"]
  );
  console.log(secondSelection.color == playerTurn);

  if (
    (secondSelection.id == posibleMoves[playerTurn]["canMove"] 
    &&
      secondSelection.piece == undefined) 
      ||
    (secondSelection.piece != undefined && canEat)
  ) {
    return true;
  } else if (secondSelection.id) {
    console.log(`Figurica ispred`);
  }

  // if (numberOfMoves < 2) {
  //   if (firstSelection.color == "white") {
  //     return (
  //       (field1[0] - 1 == field2[0] || field1[0] - 2 == field2[0]) &&
  //       field1[1] == field2[1]
  //     );
  //   } else {
  //     return (
  //       (field1[0] + 1 == field2[0] || field1[0] + 2 == field2[0]) &&
  //       field1[1] == field2[1]
  //     );
  //   }
  // } else {
  //   if (firstSelection.color == "white") {
  //     return field1[0] - 1 == field2[0] && field1[1] == field2[1];
  //   } else {
  //     // selection color black
  //     return field1[0] + 1 == field2[0] && field1[1] == field2[1];
  //   }
  // }
}
function calculatePosibleMoves() {}

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
