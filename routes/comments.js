const router = require("express").Router();
const jwtHelper = require("../lib/jwt-helper");
const dbHelper = require("../lib/db-helper");


router.post('/api/comment/:id', jwtHelper.verifyToken, async (req,res) => {
    let commentInfo = {
        postId : req.params.id,
        commentText : req.body.comment
    }
    let response = await dbHelper.executeQuery({text:"INSERT INTO comments (post_id, comment_text, created_by) values ($1,$2,$3) RETURNING id", 
                    values : [commentInfo.postId, commentInfo.commentText, req.token.user.id]});
    res.json({isSuccess :response.rows[0].id > 0 ,message :{ id: response.rows[0].id}});
});

module.exports = router;