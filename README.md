# **Reunion social API**
github repo: <https://github.com/MHFarooqui/Reunion-social-API/tree/features/db-design>
# **DB design**
Following tables are used to implement this API

**users table**

CREATE TABLE Users (

`  `Id serial primary key,

`  `Name VARCHAR(300),

`  `Email VARCHAR(300),

`  `Password VARCHAR(300),

`  `Is\_Active boolean DEFAULT true,

`  `Created\_On TIMESTAMP  DEFAULT now(),

`  `Updated\_On TIMESTAMP  DEFAULT now(),

`  `Created\_By INT,

`  `Updated\_By INT

);

**posts table**

CREATE TABLE Posts(

`  `Id serial primary key,

`  `Posted\_On VARCHAR(300),

`  `Is\_Active boolean DEFAULT true,

`  `Title varchar(300) NOT NULL,

`  `Description varchar(300) NOT NULL,

`  `Created\_On TIMESTAMP  DEFAULT now(),

`  `Updated\_On TIMESTAMP  DEFAULT now(),

`  `Created\_By INT,

`  `Updated\_By INT

);

**comments table**

CREATE TABLE Comments(

`  `Id serial primary key,

`  `Post\_Id INT REFERENCES Post (Id),

`  `Comment\_Text VARCHAR(300) NOT NULL,

`  `Is\_Active boolean DEFAULT true,

`  `Created\_On TIMESTAMP  DEFAULT now(),

`  `Updated\_On TIMESTAMP  DEFAULT now(),

`  `Created\_By INT,

`  `Updated\_By INT

);

**followings**

CREATE TABLE Followings(

`  `Id serial primary key,

`  `User\_Id INT REFERENCES Users (Id),

`  `Following INT REFERENCES Users (Id),

`  `Created\_On TIMESTAMP  DEFAULT now(),

`  `Updated\_On TIMESTAMP  DEFAULT now(),

`  `Created\_By INT,

`  `Updated\_By INT

);

**Post\_Likes**

CREATE TABLE Post\_LIKES(

`  `Id serial primary key,

`  `User\_Id INT REFERENCES Users (Id),

`  `Post\_Id INT REFERENCES Posts(Id),

`  `Is\_Liked boolean DEFAULT false,

`  `Created\_On TIMESTAMP  DEFAULT now(),

`  `Updated\_On TIMESTAMP  DEFAULT now()

);
# **Dependencies used**
- Express
- jsonWebToken <https://github.com/auth0/node-jsonwebtoken>
- pg <https://www.npmjs.com/package/pg>
- dotenv
# **Notes**
**user Profile query:**

SELECT 	u.name username,

`		`SUM(CASE fngs.user\_id WHEN 1 THEN 1 ELSE 0 END) followers, 

`		`SUM(CASE fngs.following WHEN 1 THEN 1 ELSE 0 END) followings 

FROM users u JOIN followings fngs ON (u.id = fngs.user\_id OR u.id = fngs.following)

WHERE u.id = 1

GROUP BY u.name
