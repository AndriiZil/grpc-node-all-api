const Blog = require('./models/Blog');
require('./db')

async function create() {
  try {
    const blog = await Blog.create({
      author: 'Andrii Zilnyk',
      title: 'Angular',
      content: 'Some text'
    });

    console.log(blog);
  } catch (err) {
    console.error(err);
  }
}

create().catch(console.error);
