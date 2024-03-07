const database = include('databaseConnection');

function getCurrentDateTime() {
    const now = new Date();

    // Get the current date components
    const year = now.getFullYear();
    const month = addLeadingZero(now.getMonth() + 1);
    const day = addLeadingZero(now.getDate());

    // Get the current time components
    const hours = addLeadingZero(now.getHours());
    const minutes = addLeadingZero(now.getMinutes());
    const seconds = addLeadingZero(now.getSeconds());

    // Form the SQL DATETIME string
    const sqlDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return sqlDateTime;
}

function addLeadingZero(value) {
    return value < 10 ? `0${value}` : value;
}

async function createRoom(postData) {
    let createRoomSQL = `
    insert into room (name, start_datetime) values (:roomname, :start_datetime);
	`;

    var start_datetime = getCurrentDateTime();
    let params = {
        roomname: postData.roomname,
        start_datetime: start_datetime
    }

    try {
        const results = await database.query(createRoomSQL, params);

        console.log("Successfully created tables");
        console.log(results[0]);
        return true;
    }
    catch (err) {
        console.log("Error Creating tables");
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

        console.log("Successfully created tables");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error Creating tables");
        console.log(err);
        return false;
    }
}

async function insertUsers(postData) {
    let createRoomSQL = `
        insert into room_user (user_id, room_id, last_read_message_id) values (:user_id, :room_id, 0);
	`;

    let params = {
        user_id: postData.selectedUsers,
        room_id: postData.room_id
    }

    try {
        const results = await database.query(createRoomSQL);

        console.log("Successfully created tables");
        console.log(results[0]);
        return true;
    }
    catch (err) {
        console.log("Error Creating tables");
        console.log(err);
        return false;
    }
}

module.exports = { createRoom, insertUsers, getRoomId };