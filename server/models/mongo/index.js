exports.mongoose = require('./db');
// On obtient une fonction qu'on doit executer le model, on l'execute avec l'instance de notre db
exports.Log = require('./Log')(exports.mongoose); 