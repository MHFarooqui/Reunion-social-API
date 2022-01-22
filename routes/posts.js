const router = require("express").Router();
const jwtHelper = require("../lib/jwt-helper");
const dbHelper = require("../lib/db-helper")


router.post('/api/posts', jwtHelper.verifyToken, async (req,res) => {
    let postInfo = {
        title:req.body.title,
        description : req.body.description,
        createdBy : req.token.user.id
    }
    let response = await dbHelper.executeQuery({text:"INSERT INTO posts (title, description, created_by) values ($1,$2,$3) RETURNING *", 
                    values : [postInfo.title, postInfo.description,postInfo.createdBy]});
    let isPostInserted = response.rowCount > 0;
    let postObject = response.rows[0];
    // insert record in post_likes table
    if(isPostInserted){
        await dbHelper.executeQuery({text:"INSERT INTO post_likes (post_id, user_id) values ($1,$2)", 
                    values : [postObject.id, postObject.created_by]});
    }
    res.json({isSuccess: isPostInserted, message:{id:postObject.id, title: postObject.title, description : postObject.description,createdOn: postObject.created_on}});
});

router.delete('/api/posts/:id', jwtHelper.verifyToken, async (req,res) => {
    let postId = req.params.id;
    let response = await dbHelper.executeQuery({text:"UPDATE posts SET is_Active = $1 WHERE Id = $2 AND Created_by = $3", values : [false,postId,req.token.user.id]});
    res.json({isSuccess: response.rowCount > 0, message: `Affected ${response.rowCount} records`});

});

router.post('/api/like/:id', jwtHelper.verifyToken, async (req,res) => {
    let postId = req.params.id;
    let response = await dbHelper.executeQuery({text:"UPDATE post_likes SET is_liked = $1 WHERE post_id = $2 AND user_Id = $3 ", values : [true, postId, req.token.user.id]});
    res.json({isSuccess: response.rowCount > 0, message: "post liked"});
});

router.post('/api/unlike/:id', jwtHelper.verifyToken, async (req,res) => {
    let postId = req.params.id;
    let response = await dbHelper.executeQuery({text:"UPDATE post_likes SET is_liked = $1 WHERE post_id = $2 AND user_Id = $3 ", values : [false, postId, req.token.user.id]});
    res.json({isSuccess: response.rowCount > 0, message: "post unliked"});
});

router.get('/api/posts/:id', jwtHelper.verifyToken, async (req,res) => {
    let postId = req.params.id;
    let postResult = await dbHelper.executeQuery({text:`SELECT p.id, p.title, p.description,p.created_on, COUNT(pl.is_liked)  likes, p.created_by FROM posts p join post_likes pl on p.id = pl.post_id
    WHERE p.id = $1
    group by  p.id, p.title, p.description, p.created_on,p.created_by`,values: [postId]});
    let commentResult = await dbHelper.executeQuery({text:"SELECT id, comment_text AS text, created_on, post_id, created_by  FROM comments WHERE post_id = $1;",values: [postId]});
    let postObject = postResult.rows[0];
    let commentObjects = commentResult.rows;
    res.json({isSuccess: !!postObject , message: {...postObject, comments: commentObjects} });

});

router.get('/api/all_posts', jwtHelper.verifyToken, async (req,res) => {
    let postResult = await dbHelper.executeQuery({text:`SELECT p.id, p.title, p.description,p.created_on, COUNT(pl.is_liked) likes,p.created_by FROM posts p full outer join post_likes pl on p.id = pl.post_id
    group by  p.id, p.title, p.description, p.created_on,p.created_by`});
    let commentResult = await dbHelper.executeQuery({text:"SELECT id, comment_text AS text, created_on, post_id, created_by FROM comments;"});
    let postObjects = postResult.rows;
    let commentObjects = commentResult.rows;
    let allPosts = postObjects.map(p => {
        p.comments = commentObjects.filter(c => c.post_id == p.id);
        return p; 
    })
    res.json({isSuccess: !!allPosts , message: allPosts });
});

module.exports = router;