const { Posts, Likes } = require("../models");

const { uploadImage } = require("../services/Posts/imageUpload");

const getAllPost = async (req, res) => {
  const postList = await Posts.findAll();

  res.json({ postList });
};

const createPost = async (req, res) => {
  const post = await req.body;

  const image = await uploadImage(req, res);

  post.UserId = req.user.id;
  post.image = image;

  await Posts.create(post);

  res.status(200).json({ message: "Create post success 🥳", post });
};

const getDetailImage = async (req, res) => {
  const id = req.params.publicId;

  if (!id)
    return res.status(400).json({ message: "Can not find your picture" });

  const url = await cloudinary.url(`${id}`, {
    width: 100,
    height: 150,
    Crop: "fill",
  });

  res.status(200).json({ image: `${url}` });
};

const getDetailPost = async (req, res) => {
  const { postId } = req.body;
  const id = req.params.id;
  const userId = req.user.id;

  const likedPost = await Likes.findOne({
    where: { UserId: userId, PostId: postId },
  });
  // console.log("req.user: ", req.user);

  const post = await Posts.findByPk(id);

  if (!post) res.status(404).json({ message: "Not found your blog" });
  else {
    // if (post.UserId === req.user.id) {
    //   res.status(200).json({ post, checkUser: "isPoster" });
    // } else {
    //   res.status(200).json({ post, checkUser: "isPoster" });
    // }
    res.status(200).json({ post });
  }
};

const postNewComment = async (req, res) => {
  const id = req.params.id;

  // findByPk = find by primary key ( in the database - id is the primary key )
  const post = await Posts.findByPk(id);

  res.json(post);
};

const updatePost = async (req, res) => {
  const id = req.params.id;

  const { title, subTitle, categories, content } = req.body;

  const image = await uploadImage(req, res);

  if (!req.body || !id) {
    res.status(400).send({ message: "Something is missing 🤔" });
  }

  await Posts.update(
    {
      title,
      image,
      subTitle,
      categories,
      content,
    },
    { where: { id: id } }
  );

  res.status(200).json({ message: `Update blog ${id} successfully 🥳` });
};

module.exports = {
  getAllPost,
  createPost,
  getDetailPost,
  updatePost,
  postNewComment,
  getDetailImage,
};
