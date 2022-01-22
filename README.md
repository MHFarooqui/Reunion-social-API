# **Reunion social API**
github repo: <https://github.com/MHFarooqui/Reunion-social-API/tree/features/db-design>

- API is hosted on heroku and can be tested [here](https://reunion-social-api.herokuapp.com/api)


# **LOGIN DETAILS**
 - There are 4 users seeded into db. details of which can be found in [dbScript file](https://github.com/MHFarooqui/Reunion-social-API/blob/main/dbScript.sql). to get started quickly use below user: 
    ```
    {
        "email":"sam@gmail.com",
        "password":"sam"
    }
    ```


# **DB design**
Following tables are used to implement this API

**users table**

```
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
```

**posts table**

```
CREATE TABLE Posts(
Id serial primary key,
Posted_On VARCHAR(300),
Is_Active boolean DEFAULT true,
Title varchar(300) NOT NULL,
Description varchar(300) NOT NULL,
Created_On TIMESTAMP  DEFAULT now(),
Updated_On TIMESTAMP  DEFAULT now(),
Created_By INT,
Updated_By INT
);
```

**comments table**

```
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
```

**followings**

```
CREATE TABLE Followings(
Id serial primary key,
User_Id INT REFERENCES Users (Id),
Following INT REFERENCES Users (Id),
Created_On TIMESTAMP  DEFAULT now(),
Updated_On TIMESTAMP  DEFAULT now(),
Created_By INT,
Updated_By INT
);
```

**Post_Likes**

```
CREATE TABLE Post_LIKES(
Id serial primary key,
User_Id INT REFERENCES Users (Id),
Post_Id INT REFERENCES Posts(Id),
Is_Liked boolean DEFAULT false,
Created_On TIMESTAMP  DEFAULT now(),
Updated_On TIMESTAMP  DEFAULT now()
);
```

# **Dependencies used**
- Express
- jsonWebToken <https://github.com/auth0/node-jsonwebtoken>
- pg <https://www.npmjs.com/package/pg>
- dotenv

**API Endpoints**

- POST /api/authenticate should perform user authentication and return a JWT token.
    - INPUT: 
    ```
    {
        "email":"sam@gmail.com",
        "password":"sam"
    }
    ```
    - RETURN: JWT token
    
- POST /api/follow/{id} authenticated user would follow user with {id}
- POST /api/unfollow/{id} authenticated user would unfollow a user with {id}
- GET /api/user should authenticate the request and return the respective user profile.
    - RETURN: User Name, number of followers & followings.
- POST api/posts/ would add a new post created by the authenticated user.
    - Input: Title, Description
    - RETURN: Post-ID, Title, Description, Created Time(UTC).
- DELETE api/posts/{id} would delete post with {id} created by the authenticated user.
- POST /api/like/{id} would like the post with {id} by the authenticated user.
- POST /api/unlike/{id} would unlike the post with {id} by the authenticated user.
- POST /api/comment/{id} add comment for post with {id} by the authenticated user.
    - Input: Comment
    - Return: Comment-ID
- GET api/posts/{id} would return a single post with {id} populated with its number of likes and comments
- GET /api/all_posts would return all posts created by authenticated user sorted by post time.
    - RETURN: For each post return the following values
        - id: ID of the post
        - title: Title of the post
        - desc: Description of the post
        - created_at: Date and time when the post was created
        - comments: Array of comments, for the particular post
        - likes: Number of likes for the particular post