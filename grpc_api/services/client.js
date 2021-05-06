

module.exports = {
  callListBlogs: async (client) => {
    let call;
    const blogs = [];

    try {
      const request = {};
      call = await client.listBlogs(request, () => {});
    } catch (err) {
      console.error(err);
    }

    call.on('data', response => {
      const blog = response.blog;
      blogs.push(blog);
      console.log(`Client Streaming Response ${JSON.stringify(blog)}`);
    });

    call.on('error', error => {
      console.error(error);
    });

    call.on('end', () => {
      console.log('Client End!');
      console.log(blogs);
    });
  },
  callCreateBlog: async (client) => {
    const blogRequest = {
      blog: {
        title: 'WebStorm',
        author: 'Andrii Zilnyk',
        content: 'Some Course for everyone',
      }
    }

    try {
      await client.createBlog(blogRequest, (err, response) => {
        console.log(`Received From Server ${JSON.stringify(response.blog)}`);
      });
    } catch (err) {
      console.error(err);
    }
  },
  callReadBlog: async (client) => {
    const request = { blog_id: '6093ae904c36ef638fb1b351' };

    try {
      await client.readBlog(request, (err, response) => {
        if (err) {
          return console.log(`ERROR: ${err.message}`);
        }
        console.log(`Response from the server is ${JSON.stringify(response.blog, null, 2)}`);
      });

    } catch (err) {
      console.error(err);
    }
  },
  callUpdateBlog: async (client) => {
    const request = { blog_id: '6093af3a2244e766923f6bdf', content: 'New Content 3' };

    try {
      await client.updateBlog(request, (err, response) => {
        if (err) {
          return console.log(`ERROR: ${err.message}`);
        }
        console.log(`Response from the server is ${JSON.stringify(response.blog, null, 2)}`);
      });

    } catch (err) {
      console.error(err);
    }
  },
  callDeleteBlog: async (client) => {
    try {
      const request = { blog_id: '6093aee927df0565694b619c' };
      await client.deleteBlog(request, (err, response) => {
        if (err) {
          return console.log(`ERROR: ${err.message}`);
        }
        console.log(`Was deleted ${response.blog_id}`);
      })
    } catch (err) {
      console.error(err);
    }
  }
};
