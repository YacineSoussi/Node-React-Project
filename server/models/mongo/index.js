exports.mongoose = require('../mongo/db');
// On obtient une fonction qu'on doit executer le model, on l'execute avec l'instance de notre db
exports.Log = require('./collections/Log')(exports.mongoose);
exports.Message = require('./collections/Message')(exports.mongoose);