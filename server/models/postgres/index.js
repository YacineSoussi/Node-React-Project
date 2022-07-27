exports.connection = require("./db");
exports.User = require("./entities/User");
exports.Message = require("./entities/Message");
exports.Conversation = require("./entities/Conversation");
exports.Participant = require("./entities/Participant");

const MessageMongo  = require("../mongo").Message;
const ObjectId = require("mongodb").ObjectId;


exports.User.hasMany(exports.Participant, {
    foreignKey: "userId",
});

exports.Participant.belongsTo(exports.User, {
    foreignKey: "userId",
});

exports.User.hasMany(exports.Message, {
    foreignKey: "authorId",
});

exports.Message.belongsTo(exports.User, {
    foreignKey: "authorId",
});

exports.Conversation.hasMany(exports.Message, {
    foreignKey: "conversationId",
});

exports.Message.belongsTo(exports.Conversation, {
    foreignKey: "conversationId",
});

exports.Conversation.hasMany(exports.Participant, {
    foreignKey: "conversationId",
});

exports.Participant.belongsTo(exports.Conversation, {
    foreignKey: "conversationId",
});

exports.Conversation.belongsTo(exports.Message, {
    foreignKey: "lastMessageId"
});

exports.Message.belongsTo(exports.Conversation);

function denormalizeMessage(message) {
    exports.Message.findOne({
        where: {
            id: message.id
        }
    }).then(async(message) => {
        await MessageMongo.findOneAndUpdate(
            {
                _id: new ObjectId(message.dataValues.id)
            },
            {
                ...message.dataValues,
            },
            {
                upsert: true,
            });
    });
}

function updateLastMessage(message) {
    exports.Conversation.findOne({
        where: {
            id: message.conversationId
        }
    }).then(async() => {
        await exports.Conversation.update(
            {
                lastMessageId: message.id
            },
            {
                where: {
                    id: message.conversationId
                }
            }
        );
    });
}

exports.Message.addHook("afterCreate", updateLastMessage);
exports.Message.addHook("afterCreate", denormalizeMessage);
exports.Message.addHook("afterUpdate", denormalizeMessage);
exports.Message.addHook("afterDestroy", (message) => {
    MessageMongo.deleteOne({ _id: message.id });
});