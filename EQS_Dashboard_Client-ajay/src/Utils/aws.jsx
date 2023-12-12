import AWS from "aws-sdk";

// Configure AWS
// AWS.config.update({
//   accessKeyId: "AKIASUYZ55IBFR5H5ZNV",
//   secretAccessKey: "XnhGCDy9NbtOgzB55Ko8bXm36mdvc2d2lCHZuQ+1",
//   region: "us-east-1", // e.g., us-east-1
// });

// export const s3 = new AWS.S3();


AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region:  process.env.REACT_APP_AWS_REGION, 
});

export const s3 = new AWS.S3();
