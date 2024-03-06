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

        console.log("Successfully loaded grops");
        console.log(results[0]);
        return true;
    }
    catch (err) {
        console.log("Error getting groups");
        console.log(err);
        return false;
    }
}
async function createUser(postData) {
    let createUserSQL = `
		INSERT INTO user
		(username, password)
		VALUES
		(:user, :passwordHash);
	`;

    let params = {
        user: postData.user,
        passwordHash: postData.hashedPassword
    }

    try {
        const results = await database.query(createUserSQL, params);

        console.log("Successfully created user");
        console.log(results[0]);
        return true;
    }
    catch (err) {
        console.log("Error inserting user");
        console.log(err);
        return false;
    }
}

module.exports = { createUser, getGroups };