exports.connection = require("./db");
exports.User = require("./entities/User");
exports.Message = require("./entities/Message");
const MessageMongo  = require("../mongo").Message;
const User = require("./entities/User");
const ObjectId = require("mongodb").ObjectId;

exports.User.hasMany(exports.Message);
exports.Message.belongsTo(exports.User, { as: "owner" });

function denormalizeMessage(message) {
       
    exports.Message.findOne({
        where: {
            id: message.id,
        },
        include: [{ model: User, as: "owner", attributes: ["id", "firstName"] }],
    }).then(async(message) => {
        await MessageMongo.findOneAndUpdate({ _id: new ObjectId(message.dataValues.id)  }, {
            ...message.dataValues,
        }, {
            upsert: true,
        });
    });
}

exports.Message.addHook("afterCreate", denormalizeMessage);
exports.Message.addHook("afterUpdate", denormalizeMessage);
exports.Message.addHook("afterDestroy", (message) => {
    MessageMongo.deleteOne({ _id: message.id });
});