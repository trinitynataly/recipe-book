/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 1/06/2024
Utility functions for the application.
*/

// Import the html-to-text package
import { htmlToText } from 'html-to-text';

// Define a function to generate a slug from a title
const slugify = (title) => {
    /**
     * Function to generate a slug from a title
     * @param title - The title to convert to a slug
     * 
     * @returns {string} - The generated slug
     */
    // Convert the title to a slug and return it
    return title
      .toLowerCase() // Convert to lowercase
      .trim() // Trim leading and trailing whitespace
      .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word characters with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

// Define a function to generate a unique slug
const generateUniqueSlug = async (model, baseSlug, suffix = 0, currentId = null) => {
    /**
     * Function to generate a unique slug for a recipe
     * @param model - The Mongoose model to use
     * @param baseSlug - The base slug to use
     * @param suffix - The suffix to append to the base slug (default is 0 for the first attempt)
     * @param currentId - The current recipe ID to exclude from the search (default is null)
     * 
     * @returns {string} - The unique slug
     */
    const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;
    const existingSlug = await model.findOne({ slug, _id: { $ne: currentId } });
    if (!existingSlug) {
        return slug;
    }
    return generateUniqueSlug(model, baseSlug, suffix + 1, currentId);
}

// Define a function to strip HTML tags from a string and truncate it to a given length
const stripHtml = (html, maxLength = 200) => {
    /**
     * Function to strip HTML tags from a string and truncate it to a given length
     * @param html - The HTML string to strip tags from
     * @param maxLength - The maximum length of the string to return (default is 200)
     * 
     * @returns {string} - The stripped and truncated string
     */
    // Convert the HTML to plain text
    const text = htmlToText(html, {
        wordwrap: false, // Disable word wrapping
        ignoreHref: true, // Ignore links
        ignoreImage: true, // Ignore images
      });
    // Return the text content truncated to the maximum length
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Define a function to convert minutes to a human-readable time format
  function humanReadableTime(minutes) {
    /**
     * Function to convert minutes to a human-readable time format
     * @param minutes - The number of minutes to convert
     * 
     * @returns {string} - The human-readable time format
     */
    if (minutes < 0) {
      throw new Error('Minutes cannot be negative');
    }
  
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    if (hours > 0) {
      if (remainingMinutes > 0) {
        return `${hours} hours ${remainingMinutes} minutes`;
      } else {
        return `${hours} hours`;
      }
    } else {
      return `${minutes} minutes`;
    }
  }
  

// Export the utility functions
export { slugify, generateUniqueSlug, stripHtml, humanReadableTime }