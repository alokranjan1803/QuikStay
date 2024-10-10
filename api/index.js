const express = require("express");
const app = express();
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const multer = require("multer");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const path = require("path");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

const root = path.join(__dirname, "dist");

// Use CORS middleware
app.use(
  cors({
    credentials: true,
    origin: "https://hotel-mingle-client.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(express.static(root));

app.get("/", async (req, res, next) => {
  try {
    let html = fs.readFileSync(path.resolve(root, "index.html"), "utf-8");

    // Transform HTML using Vite plugins.
    html = await viteServer.transformIndexHtml(req.url, html);

    res.send(html);
  } catch (e) {
    return next(e);
  }
});

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get("/register", (req, res) => {
  res.json("Hello User, Welcome to Hotel Booking");
});

app.get("/test", (req, res) => {
  res.json("test passed");
});

//Register routes
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

//login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json("Email and password are required.");
  }

  // Find user by email
  const userDoc = await User.findOne({ email });
  if (!userDoc) {
    // If user does not exist, return an error
    return res.status(404).json("User not found.");
  }

  // Compare the provided password with the hashed password in the database
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // If the password is correct, create and send the JWT token
    jwt.sign(
      {
        email: userDoc.email,
        id: userDoc._id,
      },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .json("An error occurred while generating the token.");
        }
        // Set the token in a cookie and return user details
        res.cookie("token", token).json(userDoc);
      }
    );
  } else {
    // If the password is incorrect, return an error
    return res.status(422).json("Incorrect password.");
  }
});

//profile route
app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });

  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }

  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { id } = userData;
    if (!id) {
      return res.status(401).json({ error: "User ID is missing in token" });
    }

    try {
      const places = await Place.find({ owner: id });
      res.json(places);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user places" });
    }
  });
});

app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place" });
  }
});

app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { id } = userData;
    if (!id) {
      return res.status(401).json({ error: "User ID is missing in token" });
    }

    const {
      id: placeId,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    } = req.body;

    try {
      const place = await Place.findById(placeId);
      if (place.owner.toString() !== id) {
        return res.status(403).json({ error: "You are not authorized to update this place" });
      }

      place.set({
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
      });

      await place.save();
      res.json(place);
    } catch (error) {
      res.status(500).json({ error: "Failed to update place" });
    }
  });
});

app.get("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
