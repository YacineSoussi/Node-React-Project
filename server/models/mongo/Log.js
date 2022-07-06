
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
    this.type = 'server';
    this.level = "info";
    console.log(LogSchema);

  });

const Log = mongoose.model('Logs', LogSchema);

return Log;

};


