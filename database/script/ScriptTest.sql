use mathsALaMaison;

SELECT * FROM User;
SELECT * FROM Questions;
SELECT * FROM sessions;
SELECT * FROM Settings;

INSERT INTO Settings (keyName, value) VALUES ('users_per_page', '10');

UPDATE Settings
SET
    value = "5"
WHERE keyName= "users_per_page";

DELETE FROM User
WHERE id = 42;

UPDATE User
SET
    specialRole = "admin"
WHERE id = 4;

DELETE FROM User
WHERE id = 29;
