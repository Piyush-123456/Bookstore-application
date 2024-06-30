const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
        console.log(file);
    },
    filename: function (req, file, cb) {
        const modifiedfilename = "Piyush" + Date.now() + path.extname(file.originalname);
        cb(null, modifiedfilename);
    }
})

const filtertype = function (req, file, cb) {
    const filetype = /jpeg|jpg|png|webp|gif|svg/
    const mimetype = filetype.test(file.mimetype);
    const extname = filetype.test(
        path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb("Error Image!");
    }

}
const upload = multer({ storage: storage, fileFilter: filtertype })
module.exports = upload;