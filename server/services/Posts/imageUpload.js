const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, `images`);
  // },
  filename: function (req, file, cb) {
    cb(null, ` ${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("image");

const uploadImage = async (req, res) => {
  try {
    res.setHeader("Content-Type", "multipart/form-data");

    if (req.file) {
      const imageLink = await uploadCloudinary(req.file.path);

      return imageLink;

      // await res.status(200).json({ message: "File uploaded", imageLink });
      // req.body.image = imageLink;
      // next();
    } else res.status(400).json({ message: "No file uploaded" });
  } catch (error) {
    console.log("🚀 ~ file: Posts.js:46 ~ router.post ~ error:", error);
  }
};

const uploadCloudinary = async (imagePath) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.url;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  upload,
  uploadImage,
};
