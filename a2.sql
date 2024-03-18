CREATE TABLE IF NOT EXISTS user (
            user_id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(25) NOT NULL,
            password VARCHAR(100) NOT NULL,
            PRIMARY KEY (user_id),
            UNIQUE INDEX unique_username (username ASC) VISIBLE); 

CREATE TABLE `freedb_3920-A01169132`.`room` (
  `room_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `start_datetime` DATETIME NOT NULL,
  PRIMARY KEY (`room_id`));

CREATE TABLE `freedb_3920-A01169132`.`message` (
  `message_id` INT NOT NULL AUTO_INCREMENT,
  `room_user_id` INT NOT NULL,
  `sent_datetime` DATETIME NOT NULL,
  `text` TEXT NOT NULL,
  PRIMARY KEY (`message_id`));

CREATE TABLE IF NOT EXISTS emojis (
            emoji_id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            image VARCHAR(50) NOT NULL,
            PRIMARY KEY (emoji_id));
            
            
CREATE TABLE room_user (
    room_user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    last_read_message_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (room_id) REFERENCES room(room_id)
);

CREATE TABLE message_emoji_user (
    message_emoji_user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	message_id INT NOT NULL,
	emoji_id INT NOT NULL,
    user_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (emoji_id) REFERENCES emojis(emoji_id),
    FOREIGN KEY (message_id) REFERENCES message(message_id)
);

drop table meesage_emoji_user;

-- Insert data into Room table
INSERT INTO room (room_id, name, start_datetime)
VALUES
  ('1', 'Besties', '2023-01-19 12:34:10'),
  ('2', 'Controversies', '2023-01-19 12:35:40'),
  ('3', 'Fav Foods', '2023-01-19 12:36:02'),
  ('4', 'Cats', '2023-01-19 12:37:08'),
  ('5', 'Dogs', '2023-01-19 12:41:31'),
  ('6', 'Vacations', '2023-01-19 12:46:52'),
  ('7', 'School Notes', '2023-01-19 12:57:08'),
  ('8', 'Jokes', '2023-01-19 13:02:24');

-- Insert data into Room_User table
INSERT INTO room_user (room_user_id, user_id, room_id, last_read_message_id)
VALUES
  ('1', '1', '1', '25'),
  ('2', '4', '1', '25'),
  ('3', '5', '1', '25'),
  ('4', '6', '1', '25'),
  ('5', '5', '2', '25'),
  ('6', '2', '2', '25'),
  ('7', '3', '2', '25'),
  ('8', '4', '2', '25'),
  ('9', '1', '3', '25'),
  ('10', '6', '3', '25'),
  ('11', '5', '3', '25'),
  ('12', '4', '3', '25'),
  ('13', '3', '3', '25'),
  ('14', '2', '3', '25'),
  ('15', '2', '4', '25'),
  ('16', '3', '4', '25'),
  ('17', '6', '4', '25'),
  ('18', '5', '5', '25'),
  ('19', '6', '5', '25'),
  ('20', '4', '5', '25'),
  ('21', '2', '6', '25'),
  ('22', '3', '6', '25'),
  ('23', '1', '7', '25'),
  ('24', '3', '7', '25'),
  ('25', '2', '7', '25'),
  ('26', '6', '7', '25'),
  ('27', '4', '7', '25'),
  ('28', '5', '7', '25'),
  ('29', '6', '8', '25'),
  ('30', '1', '8', '25'),
  ('31', '2', '8', '25');

-- Insert data into Message table
INSERT INTO message (message_id, room_user_id, sent_datetime, text)
VALUES
  ('1', '16', '2023-01-19 13:05:16', 'My favourite is orange tabbys'),
  ('2', '15', '2023-01-19 13:05:48', 'Mine is siamese'),
  ('3', '17', '2023-01-19 13:06:16', 'My cat likes to sleep in my bookshelf'),
  ('4', '15', '2023-01-19 13:06:52', 'Argh! I can\'t get my cat to stop scratching the couch!'),
  ('5', '6', '2023-01-19 13:07:51', 'I can\'t believe they raised the parking prices again!'),
  ('6', '18', '2023-01-19 13:08:26', 'German shepards are the smartest dogs.'),
  ('7', '7', '2023-01-19 13:09:08', 'I think they should raise prices. Maybe fewer people will drive and more will take transit.'),
  ('8', '8', '2023-01-19 13:09:50', 'We should get a discount if we are employees.'),
  ('9', '19', '2023-01-19 13:10:17', 'I like pugs'),
  ('10', '20', '2023-01-19 13:11:02', 'My dog loves to go for long hikes with me. He even packs his own food.'),
  ('11', '30', '2023-01-20 14:44:14', 'I saw a great movie about databases today. I can’t wait for the SQL.'),
  ('12', '23', '2023-01-20 14:52:32', 'Quiz next week on how to install the software'),
  ('13', '31', '2023-01-20 14:52:58', 'I keep all my dad jokes in a "Dad-a-base".'),
  ('14', '29', '2023-01-20 15:23:05', '3 SQL databases walked into a NoSQL bar. A little while later they walked out, because they couldn’t find a table.'),
  ('15', '21', '2023-01-20 15:33:01', 'My bucket list includes: Mexico, Bahamas, New Zealand and Scotland'),
  ('16', '9', '2023-01-20 15:33:25', 'I can\'t get enough Pizza! :P'),
  ('17', '12', '2023-01-20 15:34:05', 'I just made myself some lasagne. Gonna freeze some and take it for lunches this week.'),
  ('18', '31', '2023-01-20 15:34:24', 'To understand what recursion is, you must first understand recursion.'),
  ('19', '31', '2023-01-20 15:36:17', 'Interviewer: "Explain deadlock and we\'ll hire you."  Interviewee: "Hire me and I\'ll explain it to you."'),
  ('20', '31', '2023-01-20 15:37:54', 'Why did the programmer quit his job? Because he couldn\'t get arrays.'),
  ('21', '31', '2023-01-20 15:38:41', 'There are 2 hard problems in computer science: caching, naming, and off-by-1 errors.'),
  ('22', '31', '2023-01-20 15:40:00', 'What’s the best thing about UDP jokes? I don’t care if you get them.'),
  ('23', '1', '2023-01-20 19:02:14', 'Who wants to go to the Mall on Saturday?'),
  ('24', '4', '2023-01-20 19:05:52', 'I will!'),
  ('25', '2', '2023-01-20 19:07:17', 'What about 5PM?'),
  ('26', '1', '2023-02-06 15:12:45', 'Perfect! See you all there!'),
  ('27', '15', '2023-02-06 17:05:13', 'My cat sheds so much!'),
  ('28', '22', '2023-02-06 18:41:23', 'I want to go to Reno!'),
  ('29', '3', '2023-02-06 20:55:01', 'I can\'t make it. Have fun!');

-- Insert data into Message_Emoji_User table
INSERT INTO message_emoji_user (message_emoji_user_id, message_id, emoji_id, user_id)
VALUES
  ('1', '1', '1', '2'),
  ('2', '1', '1', '3'),
  ('3', '1', '1', '4'),
  ('4', '1', '2', '2'),
  ('5', '1', '3', '4'),
  ('6', '1', '3', '5'),
  ('7', '1', '2', '4'),
  ('8', '2', '2', '1'),
  ('9', '7', '1', '2'),
  ('10', '7', '1', '3'),
  ('11', '7', '1', '4'),
  ('12', '7', '2', '2'),
  ('13', '7', '3', '4'),
  ('14', '7', '3', '5'),
  ('15', '7', '2', '4'),
  ('16', '7', '3', '1'),
  ('17', '28', '1', '2'),
  ('18', '28', '1', '3'),
  ('19', '28', '1', '4'),
  ('20', '28', '2', '2');

-- Insert data into Emoji table
INSERT INTO emojis (emoji_id, name, image)
VALUES
  ('1', 'thumbs up', 'thumbsup.png'),
  ('2', '100 percent', '100.png'),
  ('3', 'happy face', 'happy.png');

select * from user;
select * from emojis;
select * from message;
select * from room;
select * from room_user;
select * from message_emoji_user;

#get chat rooms that a user belongs to
select R.* from user U
join room_user RU on RU.user_id = U.user_id
join room R on RU.room_id = R.room_id
where U.user_id = 1;

#select message from the specific group with user names
select M.message_id, M.sent_datetime, M.text, RU.user_id, U.username from message M
join room_user RU on M.room_user_id = RU.room_user_id
join user U on RU.user_id = U.user_id
and RU.room_id = (
	select room_id from room 
	where name = "Cats")
order by sent_datetime;    

#give all the members in the group excluding myself
select U.username from room R
join room_user RU on R.room_id = RU.room_id and R.name = "Cats"
join user U on RU.user_id = U.user_id and U.username != "tim";   

#date of most recent message in this group
select M.sent_datetime from message M
join room_user RU on M.room_user_id = RU.room_user_id
join user U on RU.user_id = U.user_id
and RU.room_id = (
	select room_id from room 
	where name = "Cats")
order by sent_datetime desc limit 1; 

#number of unread messages
select ru.user_id, ru.room_id,  MAX(room_unread.sent_datetime) AS last_message_time,COUNT(CASE WHEN room_unread.message_id is not NULL THEN 1 ELSE NULL END) AS unread_message_count
from  room_user as ru
left join (
    select  ru.room_id, m.message_id, m.sent_datetime
    from message as m
    join room_user as ru on m.room_user_id = ru.room_user_id
    where m.message_id > ru.last_read_message_id
) as room_unread on room_unread.room_id = ru.room_id
where ru.user_id=1
group by ru.user_id, ru.room_id;

#total number of groups i am in

#get all the user without myself
select username from user
where username != "";

#all users that doesnt not belong to the group 1. get user_id from current room. from user, get all user without those ids
select * from room R
join room_user RU on R.room_id = RU.room_id and R.name = "Besties"
join user U on RU.user_id = U.user_id;   

select user_id, username from user
where user_id not in (
	select U.user_id from room R
	join room_user RU on R.room_id = RU.room_id and R.name = "Besties"
	join user U on RU.user_id = U.user_id
    );

#number of unread messages in the group
select RU.user_id, RU.room_id,  MAX(room_unread.sent_datetime) AS last_message_time,COUNT(CASE WHEN room_unread.message_id is not NULL THEN 1 ELSE NULL END) AS unread_message_count
from  room_user as RU
left join (
    select  RU.room_id, M.message_id, M.sent_datetime
    from message as M
    join room_user as RU on M.room_user_id = RU.room_user_id
    where M.message_id > RU.last_read_message_id
) as room_unread on room_unread.room_id = RU.room_id
where RU.user_id=1
group by RU.user_id, RU.room_id;



select * from room_user RU
join room R on RU.room_id = R.room_id
where RU.room_id;

select room_id from room where name = "newRoom";
#create new group
insert into room (name, start_datetime) values ("new room", "2024-03-06");
insert into room_user (user_id, room_id, last_read_message_id) values ();

#get room user id
select room_user_id from room_user 
where user_id = 1 and room_id = 1;

#insert new message
select * from message;
select * from room_user;

insert into message (room_user_id, text) values (0, "");


#get last_read_message_id
select last_read_message_id from room_user
where user_id = 1 and room_id = 1;

select * from room_user;

#update last_read_message
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

#get emoji
SELECT count(E.name) as emoji_count, E.name, E.image
FROM message_emoji_user MEU
JOIN emojis E ON MEU.emoji_id = E.emoji_id
WHERE message_id = 23
GROUP BY E.name, E.image;

#add emoji
select * from emojis;

insert into message_emoji_user (message_id, emoji_id, user_id) values ();

#check if user exist in the room
SELECT U.user_id 
FROM room_user RU
JOIN user U ON U.user_id = RU.user_id
WHERE room_id = 2 and username = "tim";

#detele & reset auto increment statements
delete from user where user_id in (7,8,9);
delete from user;
ALTER TABLE user AUTO_INCREMENT = 1;
select * from user;

#tim, tony, thomas, jack, brian, dylan
delete from room_user where room_user_id in (32, 33, 34, 35);
ALTER TABLE room_user AUTO_INCREMENT = 32;
delete from room where room_id in (9, 10);
ALTER TABLE room AUTO_INCREMENT = 9;

delete from message where message_id in (30, 31, 32, 33, 34, 35);
ALTER TABLE message AUTO_INCREMENT = 30;

select * from message;

delete from room_user;
delete from message_emoji_user;


