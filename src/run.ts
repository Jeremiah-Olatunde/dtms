//---DELETE FILES NOT IN ARRAY-------------------------------------------------

// import { fileURLToPath } from "url";
// import { dirname, resolve, join } from "path";
// import fs from "fs";

// // Directory path
// const DIRECTORY = dirname(fileURLToPath(import.meta.url));
// const directoryPath = resolve(DIRECTORY, "public/img");

// // Array of file names to keep
// const fileNamesToKeep = [
//   "anim-shape-2.svg",
//   "anim-shape-1.svg",
//   "client-detail.png",
//   "arrow-icon.svg",
//   "user-experience.png",
//   "organization.png",
//   "tms_logo.png",
//   "hero-shape-group.svg",
//   "bg-shape-four.svg",
//   "hero-shape-group-2.svg",
//   "landing-page-svg.jpg",
//   "menswear.png",
//   "womenswear.png",
//   "aboutpicnew2.jpg",
//   "kidswear.png",
//   "anim-shape-3.svg",
//   "review-author3.jpg",
//   "anim-shape-6.svg",
//   "footer-tms-logo.PNG",
//   "footer-phone.svg",
//   "footer-message.png",
//   "review-author2.jpg",
//   "outfit3.jpg",
//   "outfit4.jpg",
//   "user-friendly.png",
//   "aboutpicnew1.jpg",
//   "personalization.png",
//   "financing.png",
//   "management.png",
//   "bg-shape-one.svg",
//   "section-shape.svg",
//   "features-list-bg.svg",
//   "outfit2.jpg",
//   "favicon.png",
// ]; // Add your file names here

// // Function to delete files not in the provided array
// function deleteFilesNotInArray(
//   directoryPath: string,
//   fileNamesToKeep: string[],
// ) {
//   fs.readdir(directoryPath, (err, files) => {
//     if (err) {
//       console.error("Error reading directory:", err);
//       return;
//     }

//     files.forEach((file) => {
//       if (!fileNamesToKeep.includes(file)) {
//         const filePath = join(directoryPath, file);
//         fs.unlink(filePath, (err) => {
//           if (err) {
//             console.error("Error deleting file:", err);
//           } else {
//             console.log(`${file} deleted successfully.`);
//           }
//         });
//       }
//     });
//   });
// }

// // Call the function
// deleteFilesNotInArray(directoryPath, fileNamesToKeep);

//-----------------------------------------------------------------------------

//---COMPRESS IMAGES-----------------------------------------------------------

// import imagemin from "imagemin";
// import imageminMozjpeg from "imagemin-mozjpeg";
// import imageminPngquant from "imagemin-pngquant";
// import imageminSvgo from "imagemin-svgo";

// import { fileURLToPath } from "url";
// import { dirname, resolve } from "path";

// const DIRECTORY = dirname(fileURLToPath(import.meta.url));

// const inputDir = resolve(DIRECTORY, "public/img");
// const outputDir = resolve(DIRECTORY, "public/compressed-img");

// console.log(inputDir.replaceAll("\\", "/"));
// console.log(outputDir.replaceAll("\\", "/"));

// (async () => {
//   await imagemin([`${inputDir}/*.{jpg,png}`], {
//     destination: outputDir,
//     plugins: [
//       imageminMozjpeg({ quality: 20 }),
//       imageminPngquant({
//         quality: [0.3, 0.5], // adjust quality as needed
//       }),
//       imageminSvgo({
//         plugins: [
//           {
//             name: "removeViewBox",
//             active: false,
//           },
//         ],
//       }),
//     ],
//   });

//   console.log("Images optimized");
// })();

//-----------------------------------------------------------------------------
