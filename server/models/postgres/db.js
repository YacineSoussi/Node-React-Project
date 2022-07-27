const Sequelize = require("sequelize");

const connection = new Sequelize(process.env.DB_URL, {
    useNewUrlParser: true,
    logging: false
});

connection.authenticate().then(() => {
    console.log("Connected to Postgres");
}).then(() => {
    return connection.sync();
});

module.exports = connection;