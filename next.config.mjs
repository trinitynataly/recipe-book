/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
Next.JS configuration file for the Recipe Book application.
*/

/** @type {import('next').NextConfig} */
// Define Next.JS configuration object
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode
  images: { // Configure the image component
    remotePatterns: [ // Define the remote image patterns
      // Localhost images are allowed
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**',
      },
      // DatoCMS images are allowed
      {
        protocol: 'https',
        hostname: 'www.datocms-assets.com',
        pathname: '**',
      },
      // AWS S3 images are allowed
      {
        protocol: 'https',
        hostname: 'recipebookapp.s3.ap-southeast-2.amazonaws.com',
        pathname: '**',
      }
    ],
    dangerouslyAllowSVG: true, // Allow SVG images
    contentDispositionType: 'attachment', // Set the content disposition type
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Set the content security policy
  },
  // Define the Webpack configuration
  webpack(config, options) {
    // Add the SVGR loader for SVG files
    config.module.rules.push({ // Add a new rule to the Webpack configuration
      test: /\.svg$/, // Define the file type to match
      issuer: { and: [/\.(js|ts|jsx|tsx)$/]}, // Define the file issuer
      use: ['@svgr/webpack'], // Use the SVGR loader
    });

    // Return the updated Webpack configuration
    return config;
  },
};

// Export the Next.JS configuration object
export default nextConfig;
