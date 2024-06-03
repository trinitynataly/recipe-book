/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A helper function to set up the AWS S3 client.
*/

// Import the AWS SDK
import AWS from 'aws-sdk';

// Create a new S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set the access key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set the secret access key
  region: process.env.AWS_REGION // Set the AWS region
});

// Export the S3 client
export default s3;