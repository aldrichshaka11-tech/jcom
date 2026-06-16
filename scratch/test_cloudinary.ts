import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function runTest() {
  console.log("Checking Cloudinary Credentials...");
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key:", process.env.CLOUDINARY_API_KEY);
  console.log("API Secret configured:", process.env.CLOUDINARY_API_SECRET ? "Yes (length: " + process.env.CLOUDINARY_API_SECRET.length + ")" : "No");

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Error: Missing Cloudinary environment variables in .env file.");
    return;
  }

  // Create a tiny 1x1 transparent PNG buffer
  const dummyBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64"
  );

  console.log("Attempting test upload of dummy 1x1 PNG image to Cloudinary...");
  
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "test_diagnostics" },
        (error, res) => {
          if (error) reject(error);
          else resolve(res);
        }
      );
      uploadStream.end(dummyBuffer);
    });
    console.log("Upload SUCCESSFUL!");
    console.log("Result URL:", (result as any).secure_url);
  } catch (err) {
    console.error("Upload FAILED!");
    console.error("Cloudinary Error Details:", err);
  }
}

runTest();
