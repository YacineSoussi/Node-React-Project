const { Model, DataTypes } = require("sequelize");
const connection = require("../db");
const bcryptjs = require("bcryptjs");

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                min: 8,
                max: 255,
            },
        },
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                min: 1,
            },
        },
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                min: 1,
            },
        },
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: connection,
    modelName: "user",
});

const hashPassword = async(user) => {
    user.password = await bcryptjs.hash(
        user.password,
        await bcryptjs.genSalt(10)
    );
};

User.addHook("beforeCreate", hashPassword);
User.addHook("beforeUpdate", async(user, { fields }) => {
    await hashPassword(user);
});

module.exports = User;