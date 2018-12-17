let selectedPiece = "",
  plannedMove = "",
  playerTurn = "white",
  gameStarted = false,
  numberOfMoves = 0;

let firstSelection, secondSelection; // selection figures init

function calcMoves(ref, type) {
  if (type == "knight") {
    return getKnightMovements(ref);
  }
  if (type == "pawn") {
    return getPawnMovements(ref);
  }
  if (type == "rook") {
    return getRookMovements(ref);
  }
  if (type == "bishop") {
    return getBishopMovements(ref);
  }
  if (type == "queen") {
    return getQueenMovements(ref);
  }
}


function getRookMovements(obj) {
  let coordArr = obj.fieldCoordinates,
    x = coordArr[0],
    y = coordArr[1],
    tmpArr = [];
  for (let i = 0; i < 8; i++) {
    if (i == x) {
      continue;
    }
    tmpArr.push([i, y]);
  }
  for (let z = 0; z < 8; z++) {
    if (z == y) {
      continue;
    }
    tmpArr.push([x, z]);
  }
  let movements = getAllPossibleFields(coordArr, tmpArr);
  return checkForFiguresOnPath(movements);
}


function getKnightMovements(obj) {
  let coordArr = obj.fieldCoordinates,
    x = coordArr[0],
    y = coordArr[1],
    tmpArr = [];
  for (let i = x + 1, b = 0; i < x + 3; i++, b++) {
    tmpArr.push([i, y - 2 + b]);
    tmpArr.push([i, y + 2 - b]);
    // b == 1, x == x + 2
  }
  for (let g = x - 1, z = 0; g > x - 3; g--, z++) {
    tmpArr.push([g, y - 2 + z]);
    tmpArr.push([g, y + 2 - z]);
    // g == x - 1
    // g == x - 2
  }
  let movements = getAllPossibleFields(coordArr, tmpArr);
  return checkForFiguresOnPath(movements);
}


function getPawnMovements(obj) {
  let coordArr = obj.fieldCoordinates,
    x = coordArr[0],
    y = coordArr[1],
    tmpArr = [];
  
  if (obj.color == "white") {
    for (let i = y - 1; i <= y + 1; i++) {
      tmpArr.push([x - 1, i]);
    }
  } else if (obj.color == "black") {
    for (let k = y - 1; k <= y + 1; k++) {
      tmpArr.push([x + 1, k]);
    }
  }
  let movements = getAllPossibleFields(coordArr, tmpArr);
  return pawnMovementCase(movements);
}
function pawnMovementCase(obj){
    let retObj = {
        canMove: [],
        canEat: []
      };
      
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key].length != 0) {
      let fieldId = convertCoordsToIds(obj[key][0]);
      if (table[fieldId] == undefined) {
        continue;
      } else {
        if (
          (key == "yTop" || key == "yBottom") &&
          table[fieldId].piece == undefined
        ) {
          retObj.canMove.push(fieldId);
        } else if (
          (key == "yTop" || key == "yBottom") &&
          table[fieldId].piece != undefined
        ) {
          continue;
        } else {
          retObj.canEat.push(fieldId);
        }
      }
    }
  }

  return retObj;
}


function getBishopMovements(obj) {
  let coordArr = obj.fieldCoordinates,
    x = coordArr[0],
    y = coordArr[1],
    tmpArr = [];

  for (let i = x, b = 1; i >= 0 && y - b >= 0; i--, b++) {
    tmpArr.push([x - b, y - b]);
  }
  for (let p = x, g = 1; p >= 0 && y + g <= 7; p--, g++) {
    tmpArr.push([x - g, y + g]);
  }
  for (let i = x, g = 1; i < 8; i++, g++) {
    tmpArr.push([x + g, y + g]);
  }
  for (let i = x, g = 1; i < 8; i++, g++) {
    tmpArr.push([x + g, y - g]);
  }

  let movements = getAllPossibleFields(coordArr, tmpArr);
  return checkForFiguresOnPath(movements);
}


function getQueenMovements(obj) {
  let rookMoves = getRookMovements(obj);
  let bishopMoves = getBishopMovements(obj);
  let queenMoves = {};
  queenMoves.canMove = rookMoves.canMove.concat(bishopMoves.canMove);
  queenMoves.canEat = rookMoves.canEat.concat(bishopMoves.canEat);

  return queenMoves;
}

function getAllPossibleFields(currentcoords, arrOfposibleCoords) {
  let xLeft,
    xRight,
    yTop,
    yBottom,
    yDTopLeft,
    yDTopRight,
    yDBottomLeft,
    yDBottomRight;
  xLeft = arrOfposibleCoords.filter(function(coords) {
    return coords[0] == currentcoords[0] && coords[1] < currentcoords[1];
  });
  xRight = arrOfposibleCoords.filter(function(coords) {
    return coords[0] == currentcoords[0] && coords[1] > currentcoords[1];
  });
  yTop = arrOfposibleCoords.filter(function(coords) {
    return coords[0] < currentcoords[0] && coords[1] == currentcoords[1];
  });
  yBottom = arrOfposibleCoords.filter(function(coords) {
    return coords[0] > currentcoords[0] && coords[1] == currentcoords[1];
  });
  yDTopLeft = arrOfposibleCoords.filter(function(coords) {
    return coords[0] < currentcoords[0] && coords[1] < currentcoords[1];
  });
  yDTopRight = arrOfposibleCoords.filter(function(coords) {
    return coords[0] < currentcoords[0] && coords[1] > currentcoords[1];
  });
  yDBottomLeft = arrOfposibleCoords.filter(function(coords) {
    return coords[0] > currentcoords[0] && coords[1] < currentcoords[1];
  });
  yDBottomRight = arrOfposibleCoords.filter(function(coords) {
    return coords[0] > currentcoords[0] && coords[1] > currentcoords[1];
  });
  xLeft.sort(function(a, b) {
    return b[1] - a[1];
  });
  xRight.sort(function(a, b) {
    return a[1] - b[1];
  });
  yTop.sort(function(a, b) {
    return b[0] - a[0];
  });
  yBottom.sort(function(a, b) {
    return a[0] - b[0];
  });
  yDTopLeft.sort(function(a, b) {
    return b[0] - a[0];
  });
  yDTopRight.sort(function(a, b) {
    return b[0] - a[0];
  });
  yDBottomLeft.sort(function(a, b) {
    return a[0] - b[0];
  });
  yDBottomRight.sort(function(a, b) {
    return a[0] - b[0];
  });
  return {
    xLeft,
    xRight,
    yTop,
    yBottom,
    yDTopLeft,
    yDTopRight,
    yDBottomLeft,
    yDBottomRight
  };
}

function checkForFiguresOnPath(obj) {
  let tmpArr = {
    canEat: [],
    canMove: []
  };
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key].length != 0) {
      for (let i = 0; i < obj[key].length; i++) {
        let fieldId = convertCoordsToIds(obj[key][i]);
        if (table[fieldId] != undefined) {
          if (
            table[fieldId].color != playerTurn &&
            table[fieldId].piece != undefined
          ) {
            tmpArr.canEat.push(fieldId);
            if (firstSelection.piece != "knight") {
              break;
            }
          } else if (table[fieldId].color == playerTurn) {
            if (firstSelection.piece == "knight") {
              continue;
            } else {
              break;
            }
          } else {
            tmpArr.canMove.push(fieldId);
          }
        }
      }
    }
  }
  return tmpArr;
}

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
chessTableDraw(); // game init
function updateCurrentSel(id) {
  chessTableDraw();
  firstSelection = new Figure(id); // first selection init
  firstSelection.storePossibleMoves();
  updateUi();
}
document
  .getElementById("gameContainer")
  .addEventListener("click", function(event) {
    // To - Do : Make a custom function
    let field = event.target;
    let id = field.id.slice(6);
    if (selectedPiece === "") {
      if (!table[id].color || table[id].color != playerTurn) {
        return false;
      }
      selectedPiece = Number(id);
      updateCurrentSel(selectedPiece);
      firstSelection;

    } else {
      if (table[id].color == firstSelection.color) {
        selectedPiece = Number(id);
        updateCurrentSel(selectedPiece);

        return false;
      }
      plannedMove = Number(id);
      secondSelection = new Figure(plannedMove); // 2nd field init
      if (isValidMove(firstSelection, secondSelection)) {
        // check for valid move then making a switch.
        swapPlaces(selectedPiece, plannedMove);
      } else {
        selectedPiece = "";
        chessTableDraw();
      }
    }
    if (selectedPiece != "")
      document.getElementById("field_" + id).style.background = "pink";
  });
function swapPlaces(first, second) {
  table[second] = table[first];
  table[first] = {};
  selectedPiece = "";
  playerTurn = playerTurn == "white" ? "black" : "white";
  numberOfMoves++;
  chessTableDraw();
}
function isValidMove(firstField, secondField) {
  if (
    firstField === secondField ||
    firstField.color == secondField.color ||
    firstField.color != playerTurn
  ) {
    return false;
  }
  return moveValidation(firstField, secondField);
}
function moveValidation(firstSelection, secondSelection) {
  let canMove = firstSelection["canMove"].indexOf(secondSelection.id) >= 0,
    canEat = firstSelection["canEat"].indexOf(secondSelection.id) >= 0;
  if (firstSelection.piece == "pawn") {
    if (
      (canMove && secondSelection.piece == undefined) ||
      (secondSelection.piece != undefined && canEat)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (canMove || canEat) {
      return true;
    } else {
      return false;
    }
  }
}
function convertCoordsToIds(coords) {
  let id = "xy_" + coords;
  if (document.getElementById(id) != undefined) {
    return Number(document.getElementById(id).parentElement.id.slice(6));
  }
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

// Todo: $. Add bishop moves +++
//       $. Add queen moves +++
//       $. Add king moves

//     ## First turn gets two fields of the pawn
//     ## End game solution
//     ## Checkmate detection
//     ## Check detection
//     ## Swap positions
//     ## Return Pawn to beginning

//     *** Add hints?
//     *** Calculate time?
//     *** Count Moves
//     *** Different styling
//     *** Add SASS
//     *** Gulp

//// // Bug za konja, preskace jedno polje kada treba da jede +++
