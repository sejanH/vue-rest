const Post = require('../models/post');
const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');
const jwt = require('jsonwebtoken');


router.get('/my-posts', (req, res) => {
    jwt.verify(req.query.token, 'secretkey', (err, data) => {
        if (err) {
            res.status(401).send('expired');
            throw err;
        } else {
            Post.findPostByUserId(data.id, (err, post) => {
                if (err) throw err;
                if (post.length > 0) {
                    // dateBeautify(post);
                }
                res.send(post);
            });
        }
    });
});

/* create new post */
router.post('/new/create', (req, res) => {
    jwt.verify(req.body.token, 'secretkey', (err, data) => {
        if (err) {
            res.status(401).send('expired');
            throw err;
        } else {
            const newPost = new Post.PostSchema({
                user: data.id,
                title: req.body.title,
                body: req.body.body,
                created_at: req.body.created_at,
                active: req.body.active,
                deleted: req.body.deleted,
            });
            Post.createPost(newPost, (err, post) => {
                if (err) {
                    return res.status(422).send(err)
                }
                res.send(post);
            });
        }
    });
});


router.post('/post/delete', (req, res) => {
    jwt.verify(req.body.token, 'secretkey', (err, data) => {
        if (err) {
            res.status(401).send('expired');
            throw err;
        } else {
            let post = {
                'user': data.id,
                'post': req.body.postId
            };
            Post.changePostStatus(post, (err, result) => {
                if (err) {
                    return res.status(422).send(err);
                }
                res.send(result);
            });
        }
    });
});

function dateBeautify(data) {
    data.forEach((currentValue, index, arr) => {
        let m = new Date(parseInt(currentValue.created_at));
        currentValue.created_at = m.getFullYear() + '-' + m.getMonth() + '-' + m.getDate() + ' ' + m.getHours() + ':' + m.getMinutes() + ':' + m.getSeconds();
        currentValue.tasks.forEach((val) => {
            let d = new Date(parseInt(val.created_at));
            val.created_at = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '  ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            if (val.tasks.length > 0) {
                dateBeautify(val.tasks);
            }
        });

    });

}

function dateParse(data) {
    data.forEach((currentValue, index, arr) => {
        console.log(currentValue.created_at);
        let m = "'" + new Date(currentValue.created_at) + "'";
        currentValue.created_at = Date.parse(m);
        currentValue.tasks.forEach((val) => {
            let d = "'" + new Date(val.created_at) + "'";
            val.created_at = Date.parse(d);
            if (val.tasks.length > 0) {
                dateParse(val.tasks);
            }
        });

    });
}

module.exports = router; 