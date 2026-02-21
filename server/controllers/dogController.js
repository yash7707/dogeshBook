import Dog from "../models/Dog.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";



// @desc Create dog profile
// @route POST /api/dogs
// @access Protected
export const createDog = async (req, res) => {
  try {
    const { name, breed, age } = req.body;
    let avatar = "";
    let avatarPublicId = "";

    if (!name) {
      return res.status(400).json({ message: "Dog name is required" });
    }

    // check if dog already exists for user
    const existingDog = await Dog.findOne({ owner: req.user._id });
    if (existingDog) {
      return res.status(400).json({ message: "Dog profile already exists" });
    }

       // if avatar image is uploaded
    if (req.file) {

       if (!process.env.CLOUDINARY_API_KEY) {
        throw new Error("Cloudinary env vars missing");
      }

      // upload new image using buffer
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "dogeshbook/avatars" },
            (error, result) => {
              if (result) resolve(result);
              else {
                return reject(error)};
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadFromBuffer();

      avatar = result.secure_url;
      avatarPublicId = result.public_id;
    }

    const dog = await Dog.create({
      name,
      breed,
      age,
      avatar,
      avatarPublicId,
      owner: req.user._id,
    });

    res.status(201).json(dog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user's dog
// @route GET /api/dogs/me
// @access Protected
export const getMyDog = async (req, res) => {
  try {
    const dog = await Dog.findOne({ owner: req.user._id });

    if (!dog) {
      return res.status(404).json({ message: "Dog profile not found" });
    }

    res.json(dog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update dog profile
// @route PUT /api/dogs/me
// @access Protected
export const updateDog = async (req, res) => {
  try {
    const dog = await Dog.findOne({ owner: req.user._id });

    if (!dog) {
      return res.status(404).json({ message: "Dog profile not found" });
    }

    dog.name = req.body.name || dog.name;
    dog.breed = req.body.breed || dog.breed;
    dog.age = req.body.age || dog.age;
    // dog.avatar = req.body.avatar || dog.avatar;
    // console.log(Object.fromEntries(req.body.avatar.entries()), req.file);

    if(req.body.avatar === ""){
      // delete old image if exists
      if (dog.avatarPublicId) {
        await cloudinary.uploader.destroy(dog.avatarPublicId);
      }

      dog.avatar = "";
      dog.avatarPublicId = "";
    }

       // if avatar image is uploaded
    if (req.file) {

       if (!process.env.CLOUDINARY_API_KEY) {
        throw new Error("Cloudinary env vars missing");
      }

      // delete old image if exists
      if (dog.avatarPublicId) {
        await cloudinary.uploader.destroy(dog.avatarPublicId);
      }

      // upload new image using buffer
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "dogeshbook/avatars" },
            (error, result) => {
              if (result) resolve(result);
              else {
                return reject(error)};
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadFromBuffer();

      dog.avatar = result.secure_url;
      dog.avatarPublicId = result.public_id;
    }

    const updatedDog = await dog.save();
    res.json(updatedDog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


