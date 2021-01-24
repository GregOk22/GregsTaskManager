const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const {mongoose} = require('./db/mongoose');
const bodyParser =  require('body-parser');
const multer = require('multer');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Make uploads folder publicly accessible (url / (filename in uploads))
app.use(express.static('db/uploads'));

// Load mongoose models
const { Category, Task, User, Config } = require('./db/models');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');


/* START OF MIDDLEWARE */

// Load body parser middleware
app.use(bodyParser.json());

// CORS headers middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    
    next();
});

// Check if request has valid JWT token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // Verify JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
             // JWT is invalid, do not authenticate
             res.status(401).send(err);
        } else {
            // JWT is valid.
            req.user_id = decoded._id;
            next();
        }
    });
}

// Verify refresh token
let verifySession = (req, res, next) => {
    // get refresh token from header
    let refreshToken = req.header('x-refresh-token');

    // get the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                'error': 'User not found. Make sure refresh token and user id are correct.'
            });
        }

        // user found; refresh token exists in database
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // session is valid
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // session is valid. calling next() to continue with processing web request
            next();
        } else {
            // session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid.'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

// MULTER CONFIGURATION (file storage)

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../api/db/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

/* Add filters to file
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // Accept these file types
        cb(null, true);
    } else {
        cb(null, false)
    }
};
*/

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024*1024*5
    } // additional properties can be addded (ex. fileFilter)
});


// EMAIL CONFIGURATION
// get email addresses
User.find({}, function(err, users) {
    var userEmails = new Array(users.length);
    var counter = 0;
    users.forEach(function(user) {
        var selectedUserEmail = "";
        var selectedDisplayName = "";
        var selectedCategoryTitle = "";
        var bodyOfEmailText = "";

        // saves email address to array
        userEmails[counter] = user.email;
        selectedUserEmail = user.email;
        console.log("user email: " + selectedUserEmail);
        //bodyOfEmailText += selectedUserEmail;

        //save display name from config data
        Config.find({}).then((configs) => {
            configs.forEach(function(config) {
                selectedDisplayName = config.displayName;
                console.log("display name: " + selectedDisplayName);

                // string file containing body of email (starting point)
                bodyOfEmailText += "Hello! Here's your daily summary of tasks from " + selectedDisplayName + ". \n\n";

                // get categories
                console.log('user id: ' + user.id);
                Category.find({
                    _userId: user.id
                }).then((categories) => {
                    categories.forEach(function(category) {
                        //selectedCategoryTitle = category.title;
                        // Adding category name to body of email
                        //bodyOfEmailText += "Category: " + selectedCategoryTitle + "\n";

                        console.log("Category ID: " + category._id);

                        // get tasks
                        Task.find({
                            _categoryId: category._id
                        }).then((tasks) => {
                            // Set current category title and add to body of email
                            selectedCategoryTitle = category.title;
                            bodyOfEmailText += "Category: " + selectedCategoryTitle + "\n";

                            // Loop through tasks of categories
                            tasks.forEach(function(task) {
                                console.log("Checking if im in a task");
                                console.log("Task title: " + task.title);
                                //var numberTemp = categories.length - 1;
                                //console.log("Category last index is: " + numberTemp);
                                //console.log("Current Category index: " + categories.indexOf(category) + ". Current task index" + tasks.indexOf(task));
                                
                                // add task information to body of email
                                bodyOfEmailText += "\tTask: " + task.title + "\n";
                                
                                var priorityYesNo = "No";
                                if (task.highPriority === true)
                                {
                                    priorityYesNo = "No";
                                }
                                bodyOfEmailText += "\t\tHigh Priority?: " + priorityYesNo + "\n";

                                var completedYesNo = "No";
                                if (task.completed === true)
                                {
                                    completedYesNo = "Yes";
                                }
                                bodyOfEmailText += "\t\tCompleted?: " + completedYesNo + "\n";

                                var attachmentYesNo = "No";
                                if (task.attachment != null)
                                {
                                    attachmentYesNo = "Yes";
                                }
                                bodyOfEmailText += "\t\tFile attached?: " + attachmentYesNo + "\n\n";

                                var lastCategoryIndex = categories.length - 1;
                                var lastTaskIndex = tasks.length - 1;

                                // Add an extra space if this is the last task in a category
                                if (tasks.indexOf(task) === lastTaskIndex)
                                {
                                    bodyOfEmailText += "\n";
                                }

                                if (categories.indexOf(category) === lastCategoryIndex && tasks.indexOf(task) === lastTaskIndex)
                                {
                                    console.log("This is the end of the email message body.\n");

                                    bodyOfEmailText += "Task attachments can be found in the app. Thanks for using " + selectedDisplayName + "!";
                                    console.log("Current Body of Email: " + bodyOfEmailText);

                                    //  email options
                                    let mailOptions = {
                                        from: 'taskmanagerwebappsummary@gmail.com',
                                        to: selectedUserEmail,
                                        subject: 'Daily Task Summary from ' + selectedDisplayName,
                                        text: bodyOfEmailText
                                    };

                                    // email transporter
                                    let transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'taskmanagerwebappsummary@gmail.com',
                                            pass: 'TaskManagerWebAppSummaryPass123!'
                                        }
                                    });

                                    cron.schedule('46 0 * * *', () => {
                                        // send email
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                            }
                                        });
                                    }, {
                                        scheduled: true,
                                        timezone: "America/New_York"
                                    });

                                }
                            })
                        })
                    })
                })
                
            })
        })

        let mailOptions = {
            from: 'taskmanagerwebappsummary@gmail.com',
            to: '' + userEmails[counter],
            subject: '' + Config.findOne
        };
        counter++;
    });
});

/*
let mailOptions = {
    from: 'taskmanagerwebappsummary@gmail.com',
    to:
}
*/

/* END OF MIDDLEWARE */



/* ROUTING */

/* CATEGORY ROUTES */
//read and return authenticated user's categories
app.get('/categories', authenticate, (req, res) => {
    Category.find({
        _userId: req.user_id
    }).then((categories) => {
        res.send(categories);
    }).catch((e) => {
        res.send(e);
    })
});

//create
app.post('/categories', authenticate, (req, res) => {
    let title = req.body.title;

    let newCategory = new Category({
        title, 
        _userId: req.user_id
    });
    newCategory.save().then((categoryDoc) => {
        // returns full category document with id
        res.send(categoryDoc);
    });

});

//update
app.patch('/categories/:id', authenticate, (req,res) => {
    Category.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated Successfully' });
    });
});

//delete
app.delete('/categories/:id', authenticate, (req,res) => {
    Category.findOneAndRemove({
        _id: req.params.id, 
        _userId: req.user_id
    }).then((removedCategoryDoc) => {
        res.send(removedCategoryDoc);

        // Delete all tasks in this category
        deleteTasksFromLists(removedCategoryDoc._id);
    })
});


/* TASK ROUTES */
//read all tasks in a category
app.get('/categories/:categoryId/tasks', authenticate, (req,res) => {
    Task.find({
        _categoryId: req.params.categoryId
    }).then((tasks) => {
        res.send(tasks);
    });
});

//read a task in a category
app.get('/categories/:categoryId/tasks/:taskId', authenticate, (req,res) => {
    Task.findOne({
        _id: req.params.taskId,
        _categoryId: req.params.categoryId
    }).then((task) => {
        res.send(task);
    });
});

//create a task in a category
app.post('/categories/:categoryId/tasks', authenticate, upload.single('taskAttachment'), (req,res) => {
    console.log(req.file)
    Category.findOne({
        _id: req.params.categoryId,
        _userId: req.user_id
    }).then((category) => {
        if (category) {
            // Speficied category object is valid
            // current user can create new tasks
            return true;
        }

        // else -  the category object is undefined
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new Task({
                title: req.body.title,
                _categoryId: req.params.categoryId,
                attachment: req.file.filename
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            });
        } else {
            res.sendStatus(404);
        }
    })
});

//update a task in a category
app.patch('/categories/:categoryId/tasks/:taskId', authenticate, (req,res) => {
    Category.findOne({
        _id: req.params.categoryId,
        _userId: req.user_id
    }).then((category) => {
        if (category) {
            // Speficied category object is valid
            // current user can make updates to the specified task
            return true;
        }

        // else -  the category object is undefined
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            // Current authenticated user can update tasks
            Task.findOneAndUpdate( {
                _id: req.params.taskId,
                _categoryId: req.params.categoryId
            }, {
                $set: req.body
            }).then(() => {
                res.send({  message: 'Updated successfuly!'});
            })
        } else {
            res.sendStatus(404);
        }
    })
});

//delete a task in a category
app.delete('/categories/:categoryId/tasks/:taskId', authenticate, (req,res) => {
    Category.findOne({
        _id: req.params.categoryId,
        _userId: req.user_id
    }).then((category) => {
        if (category) {
            // Speficied category object is valid
            // current user can make updates to the specified task
            return true;
        }

        // else -  the category object is undefined
        return false;
    }).then((canDeleteTasks) => {
        if(canDeleteTasks) {
            
            Task.findOneAndRemove( {
                _id: req.params.taskId,
                _categoryId: req.params.categoryId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            });
        } else {
            res.sendStatus(404);
        }
    });
});


/* USER ROUTES */
// sign up
app.post('/users', (req,res) => {

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // session created and refresh token returned
        // now generate access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => { 
            // access auth token generated successfully
            // now return an object containing auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // construct and send response to the user
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

// login
app.post('/users/login', (req,res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email,password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // session created successfully
            // now generate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access token generated successfully
                // now return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // construct and send response to the user
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    })
})


// generate and return an access token
app.get('/users/me/access-token', verifySession, (req,res) => {
    // user is authenticated. user_id and user oject is available
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

/* CONFIG ROUTES */
app.get('/configs', (req, res) => {
    Config.find({}).then((configs) => {
        res.send(configs);
    })
})

app.post('/configs', (req, res) => {
    let displayName = req.body.displayName;
    let colorCode = req.body.colorCode;

    let newConfig = new Config({
        displayName,
        colorCode
    });
    newConfig.save().then((configDoc) => {
        res.send(configDoc);
    })
})

app.patch('/configs', (req, res) => {
    Config.update({
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});


/* HELPER METHODS */
let deleteTasksFromLists = (_categoryId) => {
    Task.deleteMany({
        _categoryId,
    }).then(() => {
        console.log("Tasks from " + _categoryId + " have been deleted.");
    })
}

//app.get('/', (req,res) => {
//    res.send('Hello World!!!');
//});


const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`Listening on port ${port}...`));
