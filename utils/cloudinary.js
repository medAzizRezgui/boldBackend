const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require('dotenv')

dotenv.config()


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "DEV",
//   },
// });

// exports.uploads= (file,folder)=>{
//   return new Promise(resolve=>{
//     cloudinary.uploader.upload(file,(result)=>{
//       resolve({
//         url:result.url,
//         id:result.public_id
//       })
//     },{
//       resource_type : "auto",
//       folder:folder
//     })
//   })
// }