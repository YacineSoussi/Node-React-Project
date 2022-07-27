const Sequelize = require("sequelize");
const connection = new Sequelize("postgres://root:password@db:5432/app", {
    useNewUrlParser: true,
    logging: false
});

connection.authenticate().then(() => {
    console.log("Connected to Postgres");
}).then(() => {
    return connection.sync();
});

module.exports = connection;