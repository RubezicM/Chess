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
  if (type == "pawn") {
    if (ref.color == "white") {
      return [
        [ref.fieldCoordinates[0] - 1, ref.fieldCoordinates[1]],
        [ref.fieldCoordinates[0] - 1, ref.fieldCoordinates[1] - 1],
        [ref.fieldCoordinates[0] - 1, ref.fieldCoordinates[1] + 1]
      ];
    } else if (ref.color == "black") {
      return [
        [ref.fieldCoordinates[0] + 1, ref.fieldCoordinates[1]],
        [ref.fieldCoordinates[0] + 1, ref.fieldCoordinates[1] - 1],
        [ref.fieldCoordinates[0] + 1, ref.fieldCoordinates[1] + 1]
      ];
    }
  }
  if (type == "rook") {
    return getRookMovement(ref);

    // return field1[0] == field2[0] || field1[1] == field2[1];
  }
}
function getRookMovement(obj) {
  let coordArr = obj.fieldCoordinates,
    x = coordArr[0],
    y = coordArr[1],
    tmpArr = [];
  for (var i = 0; i < 8; i++) {
      if(i == x){
        console.log('same',i,x);
        continue;
      }
      tmpArr.push([i,y]);
  }
  for(var z=0;z < 8;z++){
      if(z == y){
        console.log('same',z,y);
        continue;
      }
      tmpArr.push([x,z]);
  }
  
  

  console.log(tmpArr);

  return tmpArr;
}
function checkForOtherFigure(xy) {
  console.log(xy);

  tmpArr = [];
  for (var i = 0; i < xy.length; i++) {
    var id = convertCoordsToIds(xy[i]);
    if (table[id] != undefined) {
      break;
    } else {
      tmpArr.push(id);
    }
  }
  return tmpArr;
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

Figure.prototype.getFieldCoords = function() {
  return [Math.floor(this.id / 8), this.id % 8];
};
Figure.prototype.storePossibleMoves = function() {
  let availableMoves = getAvailableMoves(this, this.piece),
    piece = this.piece;
  availableMoves.forEach(function(coord) {
    var currentCoord = convertCoordsToIds(coord);
    if (currentCoord != undefined) {
      if (piece == "pawn") {
        // Special case for pawn when eating and such
        // To - Do : Add two steps when the player has the first move
        if (firstSelection.fieldCoordinates[1] == coord[1]) {
          firstSelection.canMove.push(currentCoord);
        } else {
          firstSelection.canEat.push(currentCoord);
        }
      } else {
        // All other "normal" pieces
        if (table[currentCoord].piece == undefined) {
          firstSelection.canMove.push(currentCoord);
        } else {
          firstSelection.canEat.push(currentCoord);
        }
      }
    }
  });
};

let firstSelection, secondSelection;

function chessTableDraw() {
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
  document.getElementById("chessTable").innerHTML = html;
}

chessTableDraw();
function updateCurrentSel(id) {
  chessTableDraw();
  firstSelection = new Figure(id); // first selection init
  firstSelection.storePossibleMoves();
  updateUi();
}

document
  .getElementById("gameContainer")
  .addEventListener("click", function(event) {
    console.log("click");

    // To - Do : Make a custom function
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
      secondSelection = new Figure(plannedMove); // 2nd field init
      console.log(secondSelection);

      if (isValidMove(firstSelection, secondSelection)) {
        // check for valid move then making a switch.

        moveFigure(selectedPiece, plannedMove);
      } else {
        selectedPiece = "";
        console.log("Invalid move");
        delete firstSelection;
        delete secondSelection;
        chessTableDraw();
      }
    }
    //chessTableDraw();
    if (selectedPiece != "")
      document.getElementById("field_" + id).style.background = "pink";
  });
function moveFigure(first, second) {
  table[second] = table[first];
  table[first] = {};
  selectedPiece = "";
  playerTurn = playerTurn == "white" ? "black" : "white";
  numberOfMoves++;
  chessTableDraw();
  console.log("field Changed");
}

function isValidMove(firstField, secondField) {
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
  return false;
}

function isValidMoveRook(firstSelection, secondSelection) {
  console.log(firstSelection, secondSelection);
  let field1 = convertField(firstSelection.id);
  let field2 = convertField(secondSelection.id);
  console.log("field1:", field1, "field2:", field2);
  return field1[0] == field2[0] || field1[1] == field2[1];
}

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
  let canMove = firstSelection["canMove"].indexOf(secondSelection.id) >= 0,
    canEat = firstSelection["canEat"].indexOf(secondSelection.id) >= 0;
  if (canMove || canEat) {
    return true;
  } else {
    return false;
  }
}
function convertCoordsToIds(coords) {
  let id = "xy_" + coords;
  if (document.getElementById(id) != undefined) {
    return Number(document.getElementById(id).parentElement.id.slice(6));
  }
}
function isValidMovePawn(firstSelection, secondSelection) {
  let canEat = firstSelection["canEat"].indexOf(secondSelection.id) >= 0,
    canMove = firstSelection["canMove"].indexOf(secondSelection.id) == 0;
  if (
    (canMove && secondSelection.piece == undefined) ||
    (secondSelection.piece != undefined && canEat)
  ) {
    return true;
  } else if (secondSelection.id) {
    console.log(`Figurica ispred`);
  }
}

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
