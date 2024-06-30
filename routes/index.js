var express = require('express');
var router = express.Router();
var os = require("os");
const collection = require("../models/create");
const path = require('path');
const upload = require("../utils/multer").single("posterurl");
const fs = require("fs");
const { sendMail } = require("../utils/nodemailer");

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get("/library", async (req, res, next) => {
  const readbooks = await collection.find();
  res.render("library", { readbooks });
})

router.get("/about", (req, res, next) => {
  res.render("about");
})

router.get("/details-book/:id", async (req, res, next) => {
  const user = await collection.findById(req.params.id);
  console.log(user);
  res.render("details", { user });
})

router.get("/update-book/:id", async (req, res, next) => {
  const user = await collection.findById(req.params.id);
  res.render("update", { user });
})


router.post("/update-book/:id", async (req, res, next) => {
  upload(req, res, async function (err) {
    console.log(req.body.oldimage);
    try {
      const updatedbook = { ...req.body };
      if (req.file) {
        updatedbook.posterurl = req.file.filename;
        fs.unlinkSync(path.join(os.homedir(), "Desktop", "NodeJS", "bookstoremain", "public", "images", `${req.body.oldimage}`));
        const user = await collection.findByIdAndUpdate(req.params.id, updatedbook);
        console.log(user);
        res.redirect(`/details-book/${req.params.id}`)
      }
    }
    catch (err) {
      console.log(err);
    }
  })
});

// console.log(os.homedir());
// console.log(path.join(os.homedir(), "Desktop","NodeJS","bookstoremain","public","images"));

router.get("/delete-book/:id", async (req, res, next) => {
  console.log(req.params.id);
  const user = await collection.findByIdAndDelete(req.params.id);
  const filepath = path.join(os.homedir(), "Desktop", "NodeJS", "bookstoremain", "public", "images", `${user.posterurl}`);
  fs.unlinkSync(filepath);
  res.redirect("/library");
})

router.get("/create-book", (req, res, next) => {
  res.render("createbook");
})

// router.post("/create-book", upload.single('posterurl'), async (req, res, next) => {
//   try {
//     console.log(req.file.filename)
//     const newbook = new collection({ ...req.body, posterurl: req.file.filename });
//     await newbook.save();
//     res.json(newbook);
//     // res.redirect("/library");
//   }
//   catch (err) {
//     console.log(err.message);
//   }
// })

router.post("/create-book", async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      console.log(err);
      res.json(err);
      return;
    }
    else {
      try {
        const newbook = new collection({ ...req.body, posterurl: req.file.filename });
        await newbook.save();
        res.json(newbook);

      } catch (err) {
        console.log(err.message);
        res.send(err);
      }
    }
  })
})

router.post("/send-mail", (req, res, next) => {
  sendMail(req, res);
})

router.get('/search', async (req, res) => {
  const searchQuery = req.query.name;
  try {
      const books = await collection.find({ name: new RegExp(searchQuery, 'i') }); // Case-insensitive search
      res.render('search', { books });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
