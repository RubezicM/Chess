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
    let availableMoves = calcMoves(this, this.piece)
    this.canMove = availableMoves.canMove;
    this.canEat = availableMoves.canEat;
  };