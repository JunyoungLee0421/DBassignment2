const database = include('databaseConnection');

async function getGroups(postData) {
    let getGroupSQL = `
        select R.* from user U
        join room_user RU on RU.user_id = U.user_id
        join room R on RU.room_id = R.room_id
        where U.username = :user;
    `;

    let params = {
        user: postData.user
    }

    try {
        const results = await database.query(getGroupSQL, params);

        console.log("Successfully loaded groups");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting groups");
        console.log(err);
        return false;
    }
}

async function getLastSentMessage(postData) {
    let getMessageSQL = `
    select M.sent_datetime from message M
    join room_user RU on M.room_user_id = RU.room_user_id
    join user U on RU.user_id = U.user_id
    and RU.room_id = (
        select room_id from room 
        where name = :groupname)
    order by sent_datetime desc limit 1;     
    `;

    let params = {
        groupname: postData.groupname
    }

    try {
        const results = await database.query(getMessageSQL, params);

        console.log("Successfully loaded last sent messages");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting groups");
        console.log(err);
        return false;
    }
}
async function getMembers(postData) {
    let getMemberSQL = `
    select U.username from room R
    join room_user RU on R.room_id = RU.room_id and R.name = :groupname
    join user U on RU.user_id = U.user_id and U.username != :username;    
    `;

    let params = {
        groupname: postData.groupname,
        username: postData.username
    }

    try {
        const results = await database.query(getMemberSQL, params);

        console.log("Successfully loaded groups");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting groups");
        console.log(err);
        return false;
    }
}

async function getMessages(postData) {
    let getMessageSQL = `
    select M.message_id, M.sent_datetime, M.text, RU.user_id, U.username from message M
    join room_user RU on M.room_user_id = RU.room_user_id
    join user U on RU.user_id = U.user_id
    and RU.room_id = (
        select room_id from room 
        where name = :groupname)
    order by sent_datetime;     
    `;

    let params = {
        groupname: postData.groupname
    }

    try {
        const results = await database.query(getMessageSQL, params);

        console.log("Successfully loaded groups");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting groups");
        console.log(err);
        return false;
    }
}

async function getUsers(postData) {
    let getUserSQL = `
    select user_id, username from user
    where username != :username;
    `;

    let params = {
        username: postData.username
    }

    try {
        const results = await database.query(getUserSQL, params);

        console.log("Successfully loaded users");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting groups");
        console.log(err);
        return false;
    }
}



module.exports = { getGroups, getMessages, getMembers, getLastSentMessage, getUsers };