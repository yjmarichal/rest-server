// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Base de datos
// ============================
let urlDB;


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://express:EWco5wmyohbD8PCG@cluster0-wicav.mongodb.net/cafe?retryWrites=true&w=majority';
}
process.env.URLDB = urlDB;


//mongodb + srv: //express:XjPRQ9MC0DDGrqGw@cluster0-gsphv.mongodb.net/cafe?retryWrites=true&w=majority