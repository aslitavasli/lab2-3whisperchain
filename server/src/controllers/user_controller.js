import Post from '../models/post_model';

export async function createUser(postFields) {
  try {
    const post = new Post();
    post.title = postFields.title;
    post.content = postFields.content;
    if (postFields.tags) {
      post.tags = postFields.tags.trim().split(/\s+/);
    }
    post.coverUrl = postFields.coverUrl;
    post.id = post._id;
    const savedpost = await post.save();
    return savedpost;
  } catch (error) {
    throw new Error(`create post error: ${error}`);
  }
}

// returns only title, tags, and id for all posts, not content
export async function getPosts() {
  try {
    const posts = await Post.find().select('title tags coverUrl id');
    return posts;
  } catch (error) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }
}

export async function getPost(id) {
  try {
    const foundpost = await Post.findById(id);
    if (!foundpost) {
      return { error: 'This post cannot be found.' };
    }
    return foundpost;
  } catch (error) {
    throw new Error('Can\'t find this post!');
  }
}
export async function deletePost(id) {
  try {
    const deletedpost = await Post.findByIdAndDelete(id);
    if (!deletedpost) {
      throw new Error('post not found');
    }
    return { message: 'Post deleted!' };
  } catch (error) {
    throw new Error(`delete post error: ${error}`);
  }
}
export async function updatePost(id, postFields) {
  try {
    const updatedpost = await Post.findByIdAndUpdate(id, postFields, { new: true });
    if (!updatedpost) {
      throw new Error('couldn\'t update post:');
    }
    return updatedpost;
  } catch (error) {
    throw new Error('couldn\'t update post', error);
  }
}
