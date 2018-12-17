let selectedPiece = "",
  plannedMove = "",
  playerTurn = "white",
  gameStarted = false,
  numberOfMoves = 0;

function getAvailableMoves(ref, type) {
  if (type == "knight") {
    // return [
    //   [ref.fieldCoordinates[0] + 2, ref.fieldCoordinates[1] + 1],
    //   [ref.fieldCoordinates[0] + 2, ref.fieldCoordinates[1] - 1],
    //   [ref.fieldCoordinates[0] - 2, ref.fieldCoordinates[1] - 1],
    //   [ref.fieldCoordinates[0] - 2, ref.fieldCoordinates[1] + 1],
    //   [ref.fieldCoordinates[0] - 1, ref.fieldCoordinates[1] - 2],
    //   [ref.fieldCoordinates[0] - 1, ref.fieldCoordinates[1] + 2],
    //   [ref.fieldCoordinates[0] + 1, ref.fieldCoordinates[1] + 2],
    //   [ref.fieldCoordinates[0] + 1, ref.fieldCoordinates[1] - 2]
    // ];
    return getKnightMovements(ref);
  }
  if (type == "pawn") {
    return getPawnMovements(ref);
  }
  if (type == "rook") {
    return getRookMovement(ref);
  }
}
function getRookMovement(obj) {
  let coordArr = obj.fieldCoordinates,
    x = coordArr[0],
    y = coordArr[1],
    tmpArr = [];
  //("coordinate,fn rookmovement : ", coordArr);

  for (var i = 0; i < 8; i++) {
    if (i == x) {
      //("same", i, x);
      continue;
    }
    tmpArr.push([i, y]);
  }
  for (var z = 0; z < 8; z++) {
    if (z == y) {
      //("same", z, y);
      continue;
    }
    tmpArr.push([x, z]);
  }

  let movements = getPosibleMovements(coordArr, tmpArr);

  return checkForObstacles(movements);
}
function getKnightMovements(obj) {
  let coordArr = obj.fieldCoordinates,
    x = coordArr[0],
    y = coordArr[1],
    tmpArr = [];
  //   [ref.fieldCoordinates[0] + 2, ref.fieldCoordinates[1] + 1],
  //   [ref.fieldCoordinates[0] + 2, ref.fieldCoordinates[1] - 1],
  //   [ref.fieldCoordinates[0] + 1, ref.fieldCoordinates[1] + 2],
  //   [ref.fieldCoordinates[0] + 1, ref.fieldCoordinates[1] - 2]
  //   [ref.fieldCoordinates[0] - 1, ref.fieldCoordinates[1] - 2],
  //   [ref.fieldCoordinates[0] - 1, ref.fieldCoordinates[1] + 2],
  //   [ref.fieldCoordinates[0] - 2, ref.fieldCoordinates[1] + 1],
  //   [ref.fieldCoordinates[0] - 2, ref.fieldCoordinates[1] - 1],
  for (var i = x + 1, b = 0; i < x + 3; i++, b++) {
    tmpArr.push([i, y - 2 + b]);
    tmpArr.push([i, y + 2 - b]);
    // b == 1, x == x + 2
  }
  for (var g = x - 1, z = 0; g > x - 3; g--, z++) {
    tmpArr.push([g, y - 2 + z]);
    tmpArr.push([g, y + 2 - z]);
    // g == x - 1
    // g == x - 2
  }
  let movements = getPosibleMovements(coordArr, tmpArr);
  console.log(movements);
  return checkForObstacles(movements);
}

function getPawnMovements(obj) {
  let coordArr = obj.fieldCoordinates,
    x = coordArr[0],
    y = coordArr[1],
    tmpArr = [];
  let retObj = {
    canMove: [],
    canEat: []
  };
  if (obj.color == "white") {
    for (var i = y - 1; i <= y + 1; i++) {
      tmpArr.push([x - 1, i]);
    }
  } else if (obj.color == "black") {
    for (var k = y - 1; k <= y + 1; k++) {
      tmpArr.push([x + 1, k]);
    }
  }
  let movements = getPosibleMovements(coordArr, tmpArr);
  //(movements);
  for (const key in movements) {
    if (movements.hasOwnProperty(key) && movements[key].length != 0) {
      let fieldId = convertCoordsToIds(movements[key][0]);
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

function getPosibleMovements(currentcoords, arrOfposibleCoords) {
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
    return b[0] - a[0];
  });
  // //(
  //   "xleft sorted : ",
  //   xLeft,
  //   "\n",
  //   "xRight sorted: ",
  //   xRight,
  //   "\n",
  //   "yTop sorted: ",
  //   yTop,
  //   "\n",
  //   "yBottom sorted: ",
  //   yBottom,
  //   "\n",
  //   "yDTopLeft sorted: ",
  //   yDTopLeft,
  //   "\n",
  //   "yDtopRight sorted: ",
  //   yDTopRight
  // );
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
function checkForObstacles(obj) {
  let tmpArr = {
    canEat: [],
    canMove: []
  };
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key].length != 0) {
      //(key);
      for (var i = 0; i < obj[key].length; i++) {
        let fieldId = convertCoordsToIds(obj[key][i]);
        if (table[fieldId] != undefined) {
          if (
            table[fieldId].color != playerTurn &&
            table[fieldId].piece != undefined
          ) {
            tmpArr.canEat.push(fieldId);
            break;
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
  ////(piece,availableMoves,this.canEat,this.canMove);
  this.canMove = availableMoves.canMove;
  this.canEat = availableMoves.canEat;
  //(piece,availableMoves,this.canEat,this.canMove);
  //   availableMoves.forEach(function(coord) {
  //     var currentCoord = convertCoordsToIds(coord);
  //     if (currentCoord != undefined) {
  //       if (piece == "pawn") {
  //         // Special case for pawn when eating and such
  //         // To - Do : Add two steps when the player has the first move
  //         if (firstSelection.fieldCoordinates[1] == coord[1]) {
  //           firstSelection.canMove.push(currentCoord);
  //         } else {
  //           firstSelection.canEat.push(currentCoord);
  //         }
  //       } else {
  //         // All other "normal" pieces
  //         if (table[currentCoord].piece == undefined) {
  //           firstSelection.canMove.push(currentCoord);
  //         } else {
  //           firstSelection.canEat.push(currentCoord);
  //         }
  //       }
  //     }
  //   });
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
    // To - Do : Make a custom function
    let field = event.target;
    let id = field.id.slice(6);
    console.log("click");

    if (selectedPiece === "") {
      if (!table[id].color || table[id].color != playerTurn) {
        return false;
      }
      selectedPiece = Number(id);
      updateCurrentSel(selectedPiece);
      firstSelection;
      console.log(firstSelection);
    } else {
      if (table[id].color == firstSelection.color) {
        selectedPiece = Number(id);
        updateCurrentSel(selectedPiece);
        console.log(firstSelection);

        return false;
      }
      //('kme');

      plannedMove = Number(id);
      secondSelection = new Figure(plannedMove); // 2nd field init
      console.log(
        "first selection :",
        firstSelection,
        "\n",
        "secon selection :",
        secondSelection
      );

      if (isValidMove(firstSelection, secondSelection)) {
        // check for valid move then making a switch.

        moveFigure(selectedPiece, plannedMove);
      } else {
        selectedPiece = "";
        //("Invalid move");
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
  //("field Changed");
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
        //('moze');
        return true;
      } else {
        //('ne moze');
    
        return false;
      }
  }
  
}

function isValidMoveRook(firstSelection, secondSelection) {
  //(firstSelection.piece);

  let canMove = firstSelection["canMove"].indexOf(secondSelection.id) >= 0,
    canEat = firstSelection["canEat"].indexOf(secondSelection.id) >= 0;

  if (canMove || canEat) {
    //('moze');
    return true;
  } else {
    //('ne moze');

    return false;
  }
}

function isValidMoveBishop(firstSelection, secondSelection) {
  let field1 = convertField(firstSelection.id);
  let field2 = convertField(secondSelection.id);

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
    //(`Figurica ispred`);
  }
}

function isValidMoveQueen(firstSelection, secondSelection) {
  //(firstSelection, secondSelection);
  let field1 = convertField(firstSelection.id);
  let field2 = convertField(secondSelection.id);

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
