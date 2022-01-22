------------------------------
-- CREATE USERS TABLE --
------------------------------
CREATE TABLE Users (
  Id serial primary key,
  Name VARCHAR(300),
  Email VARCHAR(300),
  Password VARCHAR(300),
  Is_Active boolean DEFAULT true,
  Created_On TIMESTAMP  DEFAULT now(),
  Updated_On TIMESTAMP  DEFAULT now(),
  Created_By INT,
  Updated_By INT
);

------------------------------
-- CREATE FOLLOWINGS TABLE --
------------------------------
CREATE TABLE Followings(
  Id serial primary key,
  User_Id INT REFERENCES Users (Id),
  Following INT REFERENCES Users (Id),
  Created_On TIMESTAMP  DEFAULT now(),
  Updated_On TIMESTAMP  DEFAULT now(),
  Created_By INT,
  Updated_By INT
);

------------------------------
-- CREATE POSTS TABLE --
------------------------------
CREATE TABLE Posts(
  Id serial primary key,
  Is_Active boolean DEFAULT true,
  Title varchar(300) NOT NULL,
  Description varchar(300) NOT NULL,
  Created_On TIMESTAMP  DEFAULT now(),
  Updated_On TIMESTAMP  DEFAULT now(),
  Created_By INT,
  Updated_By INT
);

------------------------------
-- CREATE POST_LIKES TABLE --
------------------------------
CREATE TABLE Post_LIKES(
  Id serial primary key,
  User_Id INT REFERENCES Users (Id),
  Post_Id INT REFERENCES Posts(Id),
  Is_Liked boolean DEFAULT false,
  Created_On TIMESTAMP  DEFAULT now(),
  Updated_On TIMESTAMP  DEFAULT now()
);

------------------------------
-- CREATE COMMENTS TABLE --
------------------------------
CREATE TABLE Comments(
  Id serial primary key,
  Post_Id INT REFERENCES Post (Id),
  Comment_Text VARCHAR(300) NOT NULL,
  Is_Active boolean DEFAULT true,
  Created_On TIMESTAMP  DEFAULT now(),
  Updated_On TIMESTAMP  DEFAULT now(),
  Created_By INT,
  Updated_By INT
);


------------------------------
-- SEED USERS TABLE --
------------------------------
INSERT INTO users (name, email, password)
values 
	('jhon', 'jhon@gmail.com', 'jhon'),
	('kevin', 'kevin@gmail.com', 'kevin'),
	('sam',	'sam@gmail.com', 'sam'),
	('Roy',	'Roy@gmail.com', 'Roy');


------------------------------
-- SEED POSTS TABLE--
------------------------------
INSERT INTO posts (title, description, Created_By)
values 
	('post 1', 'Successfully submited post 1', 1),
	('post 2', 'Successfully submited post 2', 1),
	('post 3', 'Successfully submited post 3', 2),
	('post 4', 'Successfully submited post 4', 3);
	