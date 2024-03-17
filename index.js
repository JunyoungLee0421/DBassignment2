require('./utils');

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const { use } = require('bcrypt/promises');
const saltRounds = 12;


const database = include('databaseConnection');
const db_utils = include('database/db_utils');
const db_users = include('database/users');
const db_manager = include('database/script.js');
const create_room = include('database/create_room');
const success = db_utils.printMySQLVersion();

const port = process.env.PORT || 3000;

const app = express();

const expireTime = 1 * 60 * 60 * 1000; //expires after 1 hour  (hours * minutes * seconds * millis)


/* secret information section */
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

var mongoStore = MongoStore.create({
    mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.7uvzogm.mongodb.net/sessions`,
    crypto: {
        secret: mongodb_session_secret
    }
})

app.use(session({
    secret: node_session_secret,
    store: mongoStore, //default is memory store 
    saveUninitialized: false,
    resave: true
}
));

/**index page. if there is session, go to auth index. otherwise go to index */
app.get('/', (req, res) => {
    if (req.session.authenticated) {
        res.redirect("authindex");
    } else {
        res.render("index");
    }
});

/**auth index page, display joined rooms and their information */
app.get('/authindex', async (req, res) => {
    var username = req.session.username;
    var results = await db_manager.getGroups({ user: username });

    if (results) { //if there is results
        for (var i = 0; i < results.length; i++) {
            var lastDate = await db_manager.getLastSentMessage({ groupname: results[i].name });
            if (lastDate[0] == undefined) {
                results[i].last_sent_message_datetime = "NO MESSAGE YET";
            } else {
                const sentDateTime = new Date(lastDate[0].sent_datetime);
                const currentDate = new Date();
                const diffInDays = Math.floor((currentDate - sentDateTime) / (1000 * 60 * 60 * 24));

                if (diffInDays === 0) {
                    results[i].last_sent_message_datetime = sentDateTime.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' (today)';
                } else if (diffInDays === 1) {
                    results[i].last_sent_message_datetime = sentDateTime.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' (yesterday)';
                } else if (diffInDays <= 6) {
                    results[i].last_sent_message_datetime = sentDateTime.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' (' + diffInDays + ' days ago)';
                } else {
                    results[i].last_sent_message_datetime = sentDateTime.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + '(more than a week ago)';
                }
            }
        }
        //get number of unread messages
        var userID = await create_room.getUserId({ username: username });
        var unreadMessages = await db_manager.getNumberOfUnreadMessages({ user_id: userID[0].user_id });

        res.render("authindex", { name: username, results: results, unreadMessages: unreadMessages })
    }
})

/**chat room by room id */
app.get('/chatRoom/:room_id', async (req, res) => {
    const create_room = include('database/create_room');
    var room_id = req.params.room_id;
    //var groupname = req.query.name;
    var username = req.session.username;
    var userID = await create_room.getUserId({ username: username });
    var messages = await db_manager.getMessages({ room_id: room_id });
    var members = await db_manager.getMembers({ room_id: room_id, username: username });

    console.log(members)
    if (messages && members) {
        res.render("chatRoom", { messages: messages, members: members, user_id: userID[0].user_id, room_id: room_id })
    }
})

/**create group page */
app.get('/createGroup', async (req, res) => {
    var username = req.session.username;
    var userResults = await db_manager.getUsers({ username: username });

    res.render("createGroup", { userResults: userResults })
})

/**post method for create group */
app.post('/createGroup', (req, res) => {
    res.redirect('/createGroup');
})

/**post method for publishing (creating) group at createGroup page */
app.post('/publishGroup', async (req, res) => {
    //const create_room = include('database/create_room');

    var roomname = req.body.roomname;
    var selectedUsers = req.body.selectedUsers;
    var username = req.session.username;

    var create_room_success = await create_room.createRoom({ roomname: roomname });

    var roomID = await create_room.getRoomId({ roomname: roomname });
    var userID = await create_room.getUserId({ username: username });
    if (create_room_success) { //if create room success 
        try {
            await create_room.insertUsers({ room_id: roomID[0].room_id, user_id: userID[0].user_id })
            for (var i = 0; i < selectedUsers.length; i++) {
                await create_room.insertUsers({ room_id: roomID[0].room_id, user_id: selectedUsers[i] })
                console.log("successfully insert user into the room");
            }
            res.redirect('/')
        } catch (error) {
            res.render("errorMessage", { error: "Failed to insert user." });
        }
    } else {
        res.render("errorMessage", { error: "Failed to create user." });
    }
})

/**invite member page by room id */
app.get('/inviteMember/:room_id', async (req, res) => {
    var room_id = req.params.room_id;

    var userResults = await db_manager.getMembersNotInRoom({ room_id: room_id });
    res.render("inviteMember", { room_id: room_id, userResults: userResults })
})

/**post method for inviting users */
app.post('/invite', async (req, res) => {
    //const create_room = include('database/create_room');
    var room_id = req.body.room_id;
    var selectedUsers = req.body.selectedUsers;

    try {
        console.log(room_id);
        console.log(selectedUsers);
        console.log(selectedUsers);
        for (var i = 0; i < selectedUsers.length; i++) {
            await create_room.insertUsers({ room_id: room_id, user_id: selectedUsers[i] })
            console.log("successfully insert user into the room");
        }
        res.redirect('/chatRoom/' + room_id);
    } catch (error) {
        res.render("errorMessage", { error: "Failed to insert user." });
    }
})

/**post method for sending message to the chatroom */
app.post('/sendText', async (req, res) => {
    var username = req.session.username;
    var room_id = req.body.room_id;
    var text = req.body.text;
    var userID = await create_room.getUserId({ username: username });

    var room_user_id = await db_manager.getRoomUserId({ room_id: room_id, user_id: userID[0].user_id });

    if (room_user_id) {
        console.log(room_user_id);
        try {
            var success = await db_manager.sendMessage({ room_user_id: room_user_id[0].room_user_id, text: text });
            if (success) {
                res.redirect('/chatRoom/' + room_id);
            } else {
                res.render("errorMessage", { error: "Failed to send message." });
            }
        } catch {
            res.render("errorMessage", { error: "Failed to send message." });
        }
    }
})

/**post method for home */
app.post('/home', async (req, res) => {
    res.redirect('/');
})

/**post method for logout */
app.post('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

/**instructor's codes */
app.get('/createTables', async (req, res) => {
    const create_tables = include('database/create_tables');

    var success = create_tables.createTables();
    if (success) {
        res.render("successMessage", { message: "Created tables." });
    }
    else {
        res.render("errorMessage", { error: "Failed to create tables." });
    }
});


app.get('/login', (req, res) => {
    var badlogin = req.query.badlogin;
    var missingusername = req.query.missingusername;
    var missingpassword = req.query.missingpassword;
    res.render("login", {
        missingusername: missingusername,
        missingpassword: missingpassword,
        badlogin: badlogin
    });
});

app.get('/signup', (req, res) => {
    var missingusername = req.query.missingusername;
    var missingpassword = req.query.missingpassword;
    res.render("signup", {
        missingusername: missingusername,
        missingpassword: missingpassword
    })
});

app.post('/signup', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    var hashedPassword = bcrypt.hashSync(password, saltRounds);

    if (!username) {
        res.redirect('signup?missingusername=1')
        return;
    } else if (!password) {
        res.redirect('signup?missingpassword=1')
        return;
    }
    var success = await db_users.createUser({ user: username, hashedPassword: hashedPassword });

    if (success) {
        var results = await db_users.getUsers();
        req.session.authenticated = true;
        req.session.username = username;
        req.session.cookie.maxAge = expireTime;
        res.redirect('/');
        // res.render("members", { users: results });
    }
    else {
        res.render("errorMessage", { error: "Failed to create user." });
    }

});

app.post('/login', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    if (!username) {
        res.redirect('login?missingusername=1')
        return
    } else if (!password) {
        res.redirect('login?missingpassword=1')
        return
    }

    var results = await db_users.getUser({ user: username, hashedPassword: password });

    if (results) {
        if (results.length == 1) { //there should only be 1 user in the db that matches
            if (bcrypt.compareSync(password, results[0].password)) {
                req.session.authenticated = true;
                req.session.username = username;
                req.session.cookie.maxAge = expireTime;

                res.redirect('/');
                return;
            }
            else {
                res.redirect("login?badlogin=1");
                return
                // console.log("invalid password");
            }
        }
        else {
            console.log('invalid number of users matched: ' + results.length + " (expected 1).");
            res.redirect('login?badlogin=1');
            return;
        }
    }

    console.log('user not found');
    //user and password combination not found
    res.redirect("/login");
});

function isValidSession(req) {
    if (req.session.authenticated) {
        return true;
    }
    return false;
}

function sessionValidation(req, res, next) {
    if (!isValidSession(req)) {
        req.session.destroy();
        res.redirect('/login');
        return;
    }
    else {
        next();
    }
}

function isAdmin(req) {
    if (req.session.user_type == 'admin') {
        return true;
    }
    return false;
}

function adminAuthorization(req, res, next) {
    if (!isAdmin(req)) {
        res.status(403);
        res.render("errorMessage", { error: "Not Authorized" });
        return;
    }
    else {
        next();
    }
}

app.use('/loggedin', sessionValidation);
app.use('/loggedin/admin', adminAuthorization);

app.get('/loggedin', (req, res) => {
    res.render("loggedin");
});

app.get('/loggedin/info', (req, res) => {
    res.render("loggedin-info");
});

app.get('/loggedin/admin', (req, res) => {
    res.render("admin");
});

app.get('/cat/:id', (req, res) => {
    var cat = req.params.id;

    res.render("cat", { cat: cat });
});


app.get('/api', (req, res) => {
    var user = req.session.user;
    console.log("api hit ");

    var jsonResponse = {
        success: false,
        data: null,
        date: new Date()
    };


    if (!isValidSession(req)) {
        jsonResponse.success = false;
        res.status(401);  //401 == bad user
        res.json(jsonResponse);
        return;
    }

    if (typeof id === 'undefined') {
        jsonResponse.success = true;
        if (user_type === "admin") {
            jsonResponse.data = ["A", "B", "C", "D"];
        }
        else {
            jsonResponse.data = ["A", "B"];
        }
    }
    else {
        if (!isAdmin(req)) {
            jsonResponse.success = false;
            res.status(403);  //403 == good user, but, user should not have access
            res.json(jsonResponse);
            return;
        }
        jsonResponse.success = true;
        jsonResponse.data = [id + " - details"];
    }

    res.json(jsonResponse);

});

app.use(express.static(__dirname + "/public"));
app.use("/styles", express.static("styles"));

app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
})

app.listen(port, () => {
    console.log("Node application listening on port " + port);
}); 