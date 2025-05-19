import { Router } from 'express';
import * as Controller from './controllers/user_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

const handlePostDelete = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Controller.deletePost(req.params.id);
    // send back the result
    res.json(result);
  } catch (error) {
    console.log(error);
    // or catch the error and send back an error
    res.status(500).json({ error });
  }
};

const handlePostUpdate = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Controller.updatePost(req.params.id, req.body);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(500).json({ error });
  }
};

const handlePostCreate = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Controller.createPost(req.body);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    console.error('Create Post Error:', error.message);
    res.status(500).json({ error });
  }
};

const handlePostGet = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Controller.getPost(req.params.id);

    if (result.error) {
      res.status(404).json({ error: result.error });
    }
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(404).json({ error: 'This post cannot be found as the URL is invalid.' });
  }
};

const viewAllPosts = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Controller.getPosts();
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(500).json({ error });
  }
};

router.route('/posts')
  .post(handlePostCreate)
  .get(viewAllPosts);

router.route('/posts/:id')
  .put(handlePostUpdate)
  .get(handlePostGet)
  .delete(handlePostDelete);

export default router;
