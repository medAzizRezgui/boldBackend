const multer = require("multer");
const path = require('path')
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = "./uploads/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.originalname
      );
    },
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return "only image";
    }
  };
  
  module.exports =  multer ({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
    },
    fileFilter: fileFilter,
  });
  // module.exports = multer({
  //   storage :multer.diskStorage({}),
  //   fileFilter:(req,file,cb)=>{
  //     let ext = path.extname(file.originalname);
  //     if(ext !==".jpg" && ext !=="jpeg" && ext !=="png" && ext !==".JPG"){
  //       cb(new Error ('file type is not supported'), false)
  //       return
  //     }
  //     cb(null,true);
  //   }
  // })