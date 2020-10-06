// import other routes
const userRoutes = require('./users');

const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
        console.log("/ has started");
    });

    // // other routes
    userRoutes(app, fs);

};

module.exports = appRouter;