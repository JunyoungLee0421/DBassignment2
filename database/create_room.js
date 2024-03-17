const database = include('databaseConnection');

async function createRoom(postData) {
    let createRoomSQL = `
        insert into room (name) values (:roomname);
	`;

    let params = {
        roomname: postData.roomname,
    }

    try {
        await database.query("SET time_zone = '-07:00';");
        const results = await database.query(createRoomSQL, params);

        console.log("Successfully created room");
        console.log(results[0]);
        return true;
    }
    catch (err) {
        console.log("Error Creating room");
        console.log(err);
        return false;
    }
}

async function getRoomId(postData) {
    let getRoomIdSQL = `
        select room_id from room where name = :roomname;
    `;

    let params = {
        roomname: postData.roomname,
    }

    try {
        const results = await database.query(getRoomIdSQL, params);

        console.log("Successfully got room_id");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting room_id");
        console.log(err);
        return false;
    }
}

async function getUserId(postData) {
    let getUserIdSQL = `
        select user_id from user where username = :username;
    `;

    let params = {
        username: postData.username,
    }

    try {
        const results = await database.query(getUserIdSQL, params);

        console.log("Successfully got user_id");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting user_id");
        console.log(err);
        return false;
    }
}

async function insertUsers(postData) {
    let insertUserSQL = `
        insert into room_user (user_id, room_id, last_read_message_id) values (:user_id, :room_id, 0);
	`;

    let params = {
        user_id: postData.user_id,
        room_id: postData.room_id
    }

    try {
        const results = await database.query(insertUserSQL, params);

        console.log("Successfully inserting users");
        console.log(results[0]);
        return true;
    }
    catch (err) {
        console.log("Error inserting users");
        console.log(err);
        return false;
    }
}


module.exports = {
    createRoom,
    insertUsers,
    getRoomId,
    getUserId
};