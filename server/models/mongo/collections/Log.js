module.exports = (mongoose) => {
    const LogSchema = new mongoose.Schema({
        message: {
            type: Array,
            required: true,
        },
        type: {
            type: String,
            required: false,
        },
        level: {
            type: String,
            required: false,
        }
    });

    LogSchema.post('save', function() {
        this.type = 'server';
        this.level = "info";
    });

    const Log = mongoose.model('Logs', LogSchema);

    return Log;
};