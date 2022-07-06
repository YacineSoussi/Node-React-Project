
module.exports = (mongoose) => {
    
    const LogSchema = new mongoose.Schema({
    message: {
        type: Array,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    }
});
LogSchema.pre('save', function() {
    // add type of log
    this.type = 'server';

  });

const Log = mongoose.model('Logs', LogSchema);

return Log;

};


