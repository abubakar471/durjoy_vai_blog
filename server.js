const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const hbs = require('hbs');
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home'
    });
});

app.get('/createpost', (req, res) => {
    res.render('create.hbs', {
        pageTitle: 'create a new blog post'
    });
})

app.get('/blog', (req, res) => {
    try {
        var posts = JSON.parse(fs.readFileSync('./database/posts.json'));
        res.render('blog', {
            pageTitle: 'Blog',
            posts

        });
    } catch (e) {
        var posts = [];
        res.render('blog', {
            pageTitle: 'Blog',
            posts

        });
    }
})

app.post('/blog', (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    console.log('title : ', title);
    console.log('body : ', body);

    var addingPost = (title, body) => {
        try {
            var posts = JSON.parse(fs.readFileSync('./database/posts.json'));
            var post = {
                title,
                body,
                createdAt: new Date().toDateString()
            };
            posts.unshift(post);
            fs.writeFileSync('./database/posts.json', JSON.stringify(posts));
            res.redirect('/blog');
        } catch (e) {
            var posts = [];
            var post = {
                title,
                body,
                createdAt: new Date().toDateString()
            };
            posts.unshift(post);
            fs.writeFileSync('./database/posts.json', JSON.stringify(posts));
            res.redirect('/blog');
        }
    }

    addingPost(title, body);

})

app.listen(port, () => console.log(`server is running on ${port}`));