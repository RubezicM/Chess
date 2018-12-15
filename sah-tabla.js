let pieces = {
    pawn: { black: '♟', white: '♙' },//p 
    rook: { black: '♜', white: '♖' },//r
    knight: { black: '♞', white: '♘' },//n
    bishop: {black: '♝', white: '♗' },//b
    queen: { black: '♛', white: '♕' },//q
    king: { black: '♚', white: '♔' },//k
},
    table = fenToPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
    //table = fenToPosition('8/pppppppp/pppppppp/8/8/8/8/RNBQKBNR w KQkq - 0 1'),
    selected = { from: -1, to: -1 },
    moves = [];

function fenToPosition(fen) {
    let tmp = [];
    fen = fen.replace(/\//g, '').split(' ')[0].split('');

    
    for (let i = 0; i < fen.length; i++) {
        if (fen[i] > 0) {

            
            for (let j = 0; j < fen[i]; j++) {
                tmp.push({});
            }
        } else {
            let pairs = { p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king' };
            let color = /[A-Z]/.test(fen[i]) ? 'white' : 'black';
            let piece = '';
            for (let p in pairs) {
                if (fen[i].toLowerCase() == p) {
                    piece = fen[i].replace(fen[i], pairs[p]);
                }
            }

            tmp.push({ color, piece })
        }
    }

    
    return tmp;
}
