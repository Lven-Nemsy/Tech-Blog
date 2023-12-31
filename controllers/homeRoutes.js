const router = require('express').Router();
const { Blog, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all blogs and JOIN with user data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));
    console.log(blogs);

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogs, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const blog = blogData.get({ plain: true });

    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
     const blogData = await Blog.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });
    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('dashboard', {
      ...blogs,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard/new', withAuth, (req, res)=> {
  res.render('newBlog', {
    logged_in: req.session.logged_in,
  });
})

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
     const blogData = await Blog.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });
    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('dashboard', {
      ...blogs,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
);

module.exports = router;
