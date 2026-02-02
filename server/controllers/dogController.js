import Dog from "../models/Dog.js";

// @desc Create dog profile
// @route POST /api/dogs
// @access Protected
export const createDog = async (req, res) => {
  try {
    const { name, breed, age, avatar } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Dog name is required" });
    }

    // check if dog already exists for user
    const existingDog = await Dog.findOne({ owner: req.user._id });
    if (existingDog) {
      return res.status(400).json({ message: "Dog profile already exists" });
    }

    const dog = await Dog.create({
      name,
      breed,
      age,
      avatar,
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
    dog.avatar = req.body.avatar || dog.avatar;

    const updatedDog = await dog.save();
    res.json(updatedDog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
