// Connection hanlding to MongoDB Database

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://myUserAdmin:pass@localhost:27017/TaskManager?authSource=admin', { 
mongoose.connect('mongodb://localhost:27017/GregsTaskManager', {   
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((e) => {
    console.log("Error occured while connecting to MongoDB");
    console.log(e);
});


// Deprication warning precention
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.export = {
    mongoose
};