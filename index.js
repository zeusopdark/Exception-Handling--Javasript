const express = require('express');
const morgan = require('morgan');
const app = express();
const AppError = require('./AppError');

app.use(morgan('tiny'));//this will run on every single request and this is why it is called as mniddleware
//our own middleWare
// app.use((req, res, next) => {
//     console.log('First Middleware!!');
//     next();
// })
// app.use((req, res, next) => {
//     console.log('Second Middleware!!');
//     next();
// })

app.use((req, res, next) => {
    // req.method = 'GET' this will override
    // console.log(req.method.toUpperCase(), req.path);//gives the method and the path of the current http
    req.requestTime = Date.now();
    next();

})

//when we only want a specific path to which the middleware apply than



app.use('/dogs', (req, res, next) => {
    console.log('I Love Dogs');
    next();
})

//this will run everytime and hence for every single req it will check for the password .So the best way to provide this middleware to specific one is
// app.use((req, res, next) => {
//     const { password } = req.query;
//     if (password === 'chickennugget') {
//         next();
//     }
//     res.send('SORRY YOU nEED password');
// })

//this is a middle ware define in this function.
const verifyPass = (req, res, next) => {
    const { password } = req.query;
    if (password === 'chickennugget') {
        next();
    }
    // res.send('SORRY YOU nEED password');
    // else
    //     throw new Error('Password needed');//custom error handled
    else
        throw new AppError('Password Needed', 500);
};

//abd than provide this as middleware in those req where you want watch at line number 62
app.get('/error', (req, res) => {
    chicken.fly();
})

app.get('/', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`);
    res.send("Home page");
})

app.get('/dogs', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`);
    res.send('WOOF WOOF!');
})

app.get('/secret', verifyPass, (req, res) => {
    console.log('How Did you cleared my secret');
    res.send('Bhag bsdk');
})
app.get('/admin', (req, res) => {
    throw new AppError('You are not an Admmin', 403);
})

//this will run only when no req is matched .
app.use((req, res) => {
    res.status(404).send("Not Found!");
})

//this is the default error handler it will always run when there is an error as this is custom middleware.
// app.use((err, req, res, next) => {
//     console.log("*****************************************")
//     console.log("****************error********************")
//     console.log("*****************************************");
//     // res.status(500).send("OH BOY, WE GOT AN ERROR!");
//     next(err);
// });
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    const { message = 'Something went wrong' } = err; //indeed this message will never get print javascript provide its error this message is an default message if there is no message.
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
}) 