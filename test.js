let selectedPiece = "",
  plannedMove = "",
  playerTurn = "white",
  gameStarted = false,
  numberOfMoves = 0;

function getAvailableMoves(ref, type) {
  if (type == "knight") {
    return [
      [ref.fieldCoordinates[0] + 2, ref.fieldCoordinates[1] + 1],
      [ref.fieldCoordinates[0] + 2, ref.fieldCoordinates[1] - 1],
      [ref.fieldCoordinates[0] - 2, ref.fieldCoordinates[1] - 1],
      [ref.fieldCoordinates[0] - 2, ref.fieldCoordinates[1] + 1],
      [ref.fieldCoordinates[0] - 1, ref.fieldCoordinates[1] - 2],
      [ref.fieldCoordinates[0] - 1, ref.fieldCoordinates[1] + 2],
      [ref.fieldCoordinates[0] + 1, ref.fieldCoordinates[1] + 2],
      [ref.fieldCoordinates[0] + 1, ref.fieldCoordinates[1] - 2]
    ];
  }
}

// Move constructor
function Figure(id) {
  this.id = id;
  this.color = table[id].color;
  this.piece = table[id].piece;
  this.fieldCoordinates = this.getFieldCoords();
  this.canMove = [];
  this.canEat = [];
}
Figure.prototype.getMoves = function() {
  if (this.piece == "pawn") {
    if (this.color == "white") {
      this.canMove = [this.id - 8];
      this.canEat = [this.id - 9, this.id - 7];
    } else {
      (this.canMove = [this.id + 8]),
        (this.canEat = [this.id + 9, this.id + 7]);
    }
  } else if (this.piece == "knight") {
    let availableMoves = getAvailableMoves(this, this.piece);
    console.log(availableMoves);
    availableMoves.forEach(function(coord) {
      if (convertCoordsToIds(coord) != undefined) {
        if (table[convertCoordsToIds(coord)].color == undefined) {
          firstSelection.canMove.push(convertCoordsToIds(coord));
        } else if (table[convertCoordsToIds(coord)].color != playerTurn) {
          firstSelection.canEat.push(convertCoordsToIds(coord));
        }
      }
    });
  }
};
Figure.prototype.getFieldCoords = function() {
  return [Math.floor(this.id / 8), this.id % 8];
};
Figure.prototype.getPossibleMoves = function() {};
function convertCoords(coordsArr) {}

let firstSelection, secondSelection;

function nacrtajTabelu() {
  let html = '<table id="sahTabla">';
  for (let i = 0; i < table.length; i++) {
    let fieldIndex = convertField(i);
    if (i % 8 == 0) {
      html += "<tr>";
    }
    if (Object.keys(table[i]).length > 0) {
      let color = table[i].color;
      let piece = table[i].piece;
      html += `<td id="field_${i}">${
        pieces[piece][color]
      }<span class="field-convert" id="xy_${fieldIndex}">${fieldIndex}</span><span class="field-id">ID: ${i}</span></td>`; // {  "color": "black",   "piece": "rook" }
    } else {
      html += `<td id="field_${i}"><span class="field-convert" id="xy_${fieldIndex}">${fieldIndex}</span><span class="field-id">ID: ${i}</span></td>`;
    }
    if (i % 8 == 7) {
      html += "</tr>\n\n";
    }
  }
  html += "</table>";
  document.getElementById("table").innerHTML = html;
}

nacrtajTabelu();
function updateCurrentSel(id) {
  nacrtajTabelu();
  firstSelection = new Figure(id);
  //firstSelection.getFieldCoords();
  firstSelection.getMoves();

  updateUi();
  //convertCoordsToIds(firstSelection.fieldCoordinates);
}

document.getElementById("table").addEventListener("click", function(event) {
  let field = event.target;
  let id = field.id.slice(6);

  if (selectedPiece == "") {
    if (!table[id].color || table[id].color != playerTurn) {
      return false;
    }
    selectedPiece = Number(id);
    updateCurrentSel(selectedPiece);
    console.log(firstSelection);
  } else {
    if (table[id].color == firstSelection.color) {
      selectedPiece = Number(id);
      updateCurrentSel(selectedPiece);
      console.log(firstSelection);
      return false;
    }
    plannedMove = Number(id);
    secondSelection = new Figure(plannedMove);
    secondSelection.getFieldCoords();
    console.log(secondSelection);
    if (isValidMove(firstSelection, secondSelection)) {
      console.log("pomeraj");

      table[plannedMove] = table[selectedPiece];
      table[selectedPiece] = {};
      selectedPiece = "";
      playerTurn = playerTurn == "white" ? "black" : "white";
      numberOfMoves++;
      nacrtajTabelu();
    } else {
      selectedPiece = "";
    }
  }
  //nacrtajTabelu();
  if (selectedPiece != "")
    document.getElementById("field_" + id).style.background = "pink";
});

function isValidMove(firstField, secondField) {
  // let move = {
  //   firstSelection: {
  //     id: Number(firstSelection), // id number
  //     color: table[firstSelection].color,
  //     piece: table[firstSelection].piece
  //   },
  //   secondSelection: {
  //     id: Number(secondSelection), // id number
  //     color: table[secondSelection].color,
  //     piece: table[secondSelection].piece
  //   }
  // };
  console.log(
    "First Selection: ",
    firstField,
    table[firstField],
    "\n",
    "Second Selection: ",
    secondField,
    table[secondField],
    "ACTIVE PLAYER :",
    playerTurn,
    firstField.color == playerTurn
  );

  if (
    firstField === secondField ||
    firstField.color == secondField.color ||
    firstField.color != playerTurn
  ) {
    return false;
  }

  if (table[firstField.id].piece == "rook") {
    return isValidMoveRook(firstField, secondField);
  } else if (table[firstField.id].piece == "bishop") {
    return isValidMoveBishop(firstField, secondField);
  } else if (table[firstField.id].piece == "knight") {
    return isValidMoveKnight(firstField, secondField);
  } else if (table[firstField.id].piece == "pawn") {
    return isValidMovePawn(firstField, secondField);
  } else if (table[firstField.id].piece == "queen") {
    return isValidMoveQueen(firstField, secondField);
  }
}

function isValidMoveRook(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  let field1 = convertField(firstSelection.id);
  let field2 = convertField(secondSelection.id);
  console.log("field1:", field1, "field2:", field2);
  showPossibleMoves();
  return field1[0] == field2[0] || field1[1] == field2[1];
}
// function showPossibleMoves("rook"){

// }

function isValidMoveBishop(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  let field1 = convertField(firstSelection.id);
  let field2 = convertField(secondSelection.id);
  console.log("field1:", field1, "field2:", field2);
  return (
    field1[0] - field2[0] == field1[1] - field2[1] ||
    field1[0] - field2[0] == field2[1] - field1[1]
  );
}
function isValidMoveKnight(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  let field1 = convertField(firstSelection.id);
  let field2 = convertField(secondSelection.id);
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
function convertCoordsToIds(coords) {
  let id = "xy_" + coords;
  if (document.getElementById(id) != undefined) {
    return Number(document.getElementById(id).parentElement.id.slice(6));
  } else {
  }
}
function isValidMovePawn(firstSelection, secondSelection) {
  let canEat = firstSelection["canEat"].indexOf(secondSelection.id) >= 0;
  console.log(
    "firstSelection.id: ",
    firstSelection.id,
    "\n",
    "secondSelection.id: ",
    secondSelection.id,
    "\n",
    "posibleMoves -- id",
    firstSelection["canMove"],
    "\n",
    "canEat array :",
    firstSelection["canEat"]
  );
  console.log(secondSelection.color == playerTurn);

  if (
    (secondSelection.id == firstSelection["canMove"] &&
      secondSelection.piece == undefined) ||
    (secondSelection.piece != undefined && canEat)
  ) {
    return true;
  } else if (secondSelection.id) {
    console.log(`Figurica ispred`);
  }
}
function calculatePosibleMoves() {}

function isValidMoveQueen(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  let field1 = convertField(firstSelection.id);
  let field2 = convertField(secondSelection.id);
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

function updateUi() {
  let allowedFields = firstSelection.canMove,
    eatingFields = firstSelection.canEat;
  document.getElementById("field_" + firstSelection.id).style.background =
    "pink";
  allowedFields.forEach(function(field) {
    if (table[field].color == undefined && table[field].color != playerTurn) {
      document.getElementById("field_" + field).style.backgroundColor =
        "orange";
    }
  });
  if (eatingFields.length > 0) {
    eatingFields.forEach(function(field) {
      if (table[field].color != undefined && table[field].color != playerTurn) {
        document.getElementById("field_" + field).style.backgroundColor =
          "green";
      }
    });
  }
}
