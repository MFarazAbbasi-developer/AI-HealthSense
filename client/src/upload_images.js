import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// 🔐 Replace with your own Cloudinary credentials
cloudinary.config({
  cloud_name: "dwb9intbs",     // e.g., "dljk3x0vd"
  api_key: "858669666459175",           // e.g., "123456789012345"
  api_secret: "GuFaOS6IAwyLSaxJBHxOvlcJ5So",     // e.g., "ABCDEF-YourSecretHere"
});

// 📁 Local folder containing doctor images
const folderPath = "./Doctor_Profile_pictures";

// 🌤 Upload function
const uploadToCloudinary = async () => {
  try {
    const files = fs.readdirSync(folderPath);

    for (let file of files) {
      const filePath = path.join(folderPath, file);

      // ⬆️ Upload each file to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "ai_healthsense_doctors",  // Cloudinary folder name (you can change it)
        public_id: path.parse(file).name,  // Optional: use filename (without extension) as public_id
        overwrite: true                    // Allows re-uploading if same public_id exists
      });

      console.log(`✅ Uploaded ${file}: ${result.secure_url}`);
    }
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
};

uploadToCloudinary();
