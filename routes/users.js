const router = require("express").Router();
const jwtHelper = require("../lib/jwt-helper");
const dbHelper = require("../lib/db-helper")

router.post('/api/authenticate', async (req, res) => {
    // get email & password from req body
    const loginInfo = {
        email: req.body.email,
        password: req.body.password
    };
    // get user from db, if any user with given email & password exist
    const response = await dbHelper.executeQuery({ text: `SELECT * from Users where Email = $1 AND Password = $2`, values: [loginInfo.email, loginInfo.password] });
    const user = response.rows[0];
    // if found user then generate token for that user
    if (!!user) {
        const token = jwtHelper.generateJwtToken(user);
        res.json({ token });
    }
    else {
        // if not found then send 403 status.
        res.sendStatus(403)
    }
});

router.post('/api/follow/:id', jwtHelper.verifyToken, async (req, res) => {
    let userToBeFollowed = req.params.id;
    let authUser = req.token.user;
    let isAlreadyFollowing = await dbHelper.executeQuery({ text: `SELECT COUNT(*) FROM followings where following = $1 AND User_Id = $2`, values: [userToBeFollowed, authUser.id] });
    if (isAlreadyFollowing.rows[0].count > 0) {
        res.json({ isSuccess: false, message: 'Already following' });
    } else {
        let response = await dbHelper.executeQuery({ text: `INSERT INTO followings(User_Id, Following) VALUES ($1 , $2)`, values: [authUser.id, userToBeFollowed] });
        res.json({ isSuccess: response.rowCount > 0, message: 'Followed' });
    }
})


router.post('/api/unfollow/:id', jwtHelper.verifyToken, async (req, res) => {
    let userToBeUnfollowed = req.params.id;
    let authUser = req.token.user;
    let isAlreadyUnfollowing = await dbHelper.executeQuery({ text: `SELECT COUNT(*) FROM followings where following = $1 AND User_Id = $2`, values: [userToBeUnfollowed, authUser.id] });
    if (isAlreadyUnfollowing.rows[0].count == 0) {
        res.json({ isSuccess: false, message: 'Already not following' });
    } else {
        let response = await dbHelper.executeQuery({ text: `DELETE FROM followings WHERE following = $1 AND User_Id = $2`, values: [userToBeUnfollowed, authUser.id] });
        res.json({ isSuccess: response.rowCount == 0, message: 'UnFollowed' });
    }
})

router.get('/api/user', jwtHelper.verifyToken, async (req, res) => {
    let authUser = req.token.user;
    let response = await dbHelper.executeQuery({ text: `SELECT 	u.name username,
    SUM(CASE fngs.user_id WHEN 1 THEN 1 ELSE 0 END) followers, 
    SUM(CASE fngs.following WHEN 1 THEN 1 ELSE 0 END) followings 
    FROM users u full outer JOIN followings fngs ON (u.id = fngs.user_id OR u.id = fngs.following)
    WHERE u.id = $1
    GROUP BY u.name`, values: [ authUser.id] });
    res.json({isSuccess: !!response.rows[0], message:response.rows[0]});
})


module.exports = router;