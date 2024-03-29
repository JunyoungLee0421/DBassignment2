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
    join room_user RU on R.room_id = RU.room_id and R.room_id = :room_id
    join user U on RU.user_id = U.user_id and U.username != :username;    
    `;

    let params = {
        //groupname: postData.groupname,
        room_id: postData.room_id,
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

async function getMembersNotInRoom(postData) {
    let getMemberSQL = `
    select user_id, username from user
    where user_id not in (
        select U.user_id from room R
        join room_user RU on R.room_id = RU.room_id and R.room_id = :room_id
        join user U on RU.user_id = U.user_id
        );  
    `;

    let params = {
        //groupname: postData.groupname,
        room_id: postData.room_id,
    }

    try {
        const results = await database.query(getMemberSQL, params);

        console.log("Successfully loaded members");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting members");
        console.log(err);
        return false;
    }
}

async function getMessages(postData) {
    let getMessageSQL = `
    select M.message_id, M.sent_datetime, M.text, RU.user_id, U.username from message M
    join room_user RU on M.room_user_id = RU.room_user_id
    join user U on RU.user_id = U.user_id
    and RU.room_id = :room_id
    order by sent_datetime;     
    `;

    let params = {
        room_id: postData.room_id
        //groupname: postData.groupname
    }

    try {
        const results = await database.query(getMessageSQL, params);

        console.log("Successfully loaded messages");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting messages");
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
        console.log("Error getting users");
        console.log(err);
        return false;
    }
}

async function getNumberOfUnreadMessages(postData) {
    // let getNumberOfUnreadMessagesSQL = `
    // select RU.user_id, RU.room_id,  MAX(room_unread.sent_datetime) AS last_message_time,COUNT(CASE WHEN room_unread.message_id is not NULL THEN 1 ELSE NULL END) AS unread_message_count
    // from  room_user as RU
    // left join (
    //     select  RU.room_id, M.message_id, M.sent_datetime
    //     from message as M
    //     join room_user as RU on M.room_user_id = RU.room_user_id
    //     where M.message_id > RU.last_read_message_id
    // ) as room_unread on room_unread.room_id = RU.room_id
    // where RU.user_id = :user_id
    // group by RU.user_id, RU.room_id;
    // `;

    let getNumberOfUnreadMessagesSQL = `
    WITH LastRead AS (
        SELECT last_read_message_id
        FROM room_user
        WHERE room_user_id = :room_user_id
    )
    SELECT 
        COUNT(M.message_id) AS unread_message_count
    FROM 
        message M
    JOIN 
        room_user RU ON RU.room_user_id = M.room_user_id
    JOIN 
        room R ON R.room_id = RU.room_id AND R.room_id = :room_id
    JOIN 
        LastRead LR ON M.message_id > LR.last_read_message_id;
    ;
    `;

    let params = {
        room_id: postData.room_id,
        room_user_id: postData.room_user_id
    }

    try {
        const results = await database.query(getNumberOfUnreadMessagesSQL, params);

        console.log("Successfully loaded number of unread messages");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting number of unread messages");
        console.log(err);
        return false;
    }
}

async function getRoomUserId(postData) {
    let getRoomUserIdSQL = `
    select room_user_id from room_user 
    where user_id = :user_id and room_id = :room_id;
    `;

    let params = {
        user_id: postData.user_id,
        room_id: postData.room_id
    }

    try {
        const results = await database.query(getRoomUserIdSQL, params);

        console.log("Successfully got room user id");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting room user id");
        console.log(err);
        return false;
    }
}

async function sendMessage(postData) {
    let sendMessageSQL = `
    insert into message (room_user_id, text) values (:room_user_id, :text);
    `;

    let params = {
        room_user_id: postData.room_user_id,
        text: postData.text
    }

    try {
        await database.query("SET time_zone = '-07:00';");
        const results = await database.query(sendMessageSQL, params);

        console.log("Successfully sent message");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error sending message");
        console.log(err);
        return false;
    }
}
async function getLastReadMessageId(postData) {
    let getLastReadMessageIdSQL = `
    select last_read_message_id from room_user
    where user_id = :user_id and room_id = :room_id;
    `;

    let params = {
        room_id: postData.room_id,
        user_id: postData.user_id
    }

    try {
        const results = await database.query(getLastReadMessageIdSQL, params);

        console.log("Successfully loaded last read message id");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error loading last read message id");
        console.log(err);
        return false;
    }
}

async function updateLastReadMessage(postData) {
    let updateLastReadMessageSQL = `
    UPDATE room_user
        SET last_read_message_id = (
            SELECT MAX(message_id) FROM (
                SELECT M.message_id
                FROM message M
                JOIN room_user RU ON RU.room_user_id = M.room_user_id
                JOIN room R ON R.room_id = RU.room_id 
                WHERE R.room_id = :room_id
            ) AS subquery
        )
        WHERE user_id = :user_id AND room_id = :room_id;
    `;

    let params = {
        room_id: postData.room_id,
        user_id: postData.user_id
    }

    try {
        const results = await database.query(updateLastReadMessageSQL, params);

        console.log("Successfully update last read message id");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error updating last read message id");
        console.log(err);
        return false;
    }
}

async function getEmojis(postData) {
    let getEmojisSQL = `
    SELECT count(E.name) as emoji_count, E.name, E.image
    FROM message_emoji_user MEU
    JOIN emojis E ON MEU.emoji_id = E.emoji_id
    WHERE message_id = :message_id
    GROUP BY E.name, E.image;
    `;

    let params = {
        message_id: postData.message_id
    }

    try {
        const results = await database.query(getEmojisSQL, params);

        console.log("Successfully got emojis");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting emojis");
        console.log(err);
        return false;
    }
}

async function addEmoji(postData) {
    let updateEmojiSQL = `
    insert into message_emoji_user (message_id, emoji_id, user_id) values (:message_id, :emoji_id, :user_id);
    `;

    let params = {
        message_id: postData.message_id,
        emoji_id: postData.emoji_id,
        user_id: postData.user_id
    }

    try {
        const results = await database.query(updateEmojiSQL, params);

        console.log("Successfully added emoji");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error adding emoji");
        console.log(err);
        return false;
    }
}

async function getEmojis(postData) {
    let getEmojisSQL = `
    SELECT count(E.name) as emoji_count, E.name, E.image
    FROM message_emoji_user MEU
    JOIN emojis E ON MEU.emoji_id = E.emoji_id
    WHERE message_id = :message_id
    GROUP BY E.name, E.image;
    `;

    let params = {
        message_id: postData.message_id
    }

    try {
        const results = await database.query(getEmojisSQL, params);

        console.log("Successfully got emojis");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error getting emojis");
        console.log(err);
        return false;
    }
}

async function checkUser(postData) {
    let checkUserSQL = `
    SELECT U.user_id 
    FROM room_user RU
    JOIN user U ON U.user_id = RU.user_id
    WHERE room_id = :room_id and U.user_id = :user_id;
    `;

    let params = {
        room_id: postData.room_id,
        user_id: postData.user_id
    }

    try {
        const results = await database.query(checkUserSQL, params);

        console.log("Successfully loaded user");
        console.log(results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error loading user");
        console.log(err);
        return false;
    }
}

module.exports = {
    getGroups,
    getMessages,
    getMembers,
    getLastSentMessage,
    getUsers,
    getMembersNotInRoom,
    getNumberOfUnreadMessages,
    getRoomUserId,
    sendMessage,
    getEmojis,
    addEmoji,
    updateLastReadMessage,
    checkUser,
    getLastReadMessageId,

};