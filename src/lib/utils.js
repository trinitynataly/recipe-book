/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 1/06/2024
Utility functions for the application.
*/

// Import the html-to-text package
import { htmlToText } from 'html-to-text';

/**
 * Function to generate a slug from a title
 * @param {string} title - The title to convert to a slug
 * @returns {string} - The generated slug
 */
const slugify = (title) => {
  // Convert the title to a slug and return it
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Trim leading and trailing whitespace
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word characters with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Function to ensure a generated slug is unique
 * @param {Model} model - The Mongoose model to query for existing slugs
 * @param {string} baseSlug - The base slug to use
 * @param {number} suffix - The suffix to append to the base slug
 * @param {string} currentId - The ID of the current recipe (to exclude from the query)
 * @returns {string} - The unique slug
 */
const generateUniqueSlug = async (model, baseSlug, suffix = 0, currentId = null) => {
  // Generate the full slug with the suffix
  const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;
  // Check if a document with the slug already exists
  const existingSlug = await model.findOne({ slug, _id: { $ne: currentId } });
  // If the slug is unique, return it
  if (!existingSlug) return slug;
  // If the slug is not unique, generate a new slug with an incremented suffix
  return generateUniqueSlug(model, baseSlug, suffix + 1, currentId);
}

/**
 * Function to strip HTML tags from a string and truncate it to a given length
 * @param {string} html - The HTML string to strip and truncate
 * @param {number} maxLength - The maximum length of the string
 * @returns {string} - The stripped and truncated string
 */
const stripHtml = (html, maxLength = 200) => {
  // Convert the HTML to plain text
  const text = htmlToText(html, {
    wordwrap: false, // Disable word wrapping
    ignoreHref: true, // Ignore links
    ignoreImage: true, // Ignore images
  });
  // Return the text content truncated to the maximum length
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Function to convert minutes to a human-readable time format
 * @param {number} minutes - The number of minutes
 * @returns {string} - The human-readable time format
 */
  function humanReadableTime(minutes) {
    // Check if the minutes are negative
    if (minutes < 0) {
      // Return an error message
      return '0 minutes';
    }

    // Calculate the hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    // Calculate the remaining minutes
    const remainingMinutes = minutes % 60;

    // Return the formatted time string
    if (hours > 0) { // If there are hours
      // Check if there are remaining minutes
      if (remainingMinutes > 0) {
        // Return the formatted time string with hours and minutes
        return `${hours} hours ${remainingMinutes} minutes`;
      } else {
        // Return the formatted time string with hours only
        return `${hours} hours`;
      }
    } else {
      // Return the formatted time string with minutes only
      return `${minutes} minutes`;
    }
  }
  
// Export the utility functions
export { slugify, generateUniqueSlug, stripHtml, humanReadableTime }