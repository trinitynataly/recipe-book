/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 1/06/2024
Utility functions for the application.
*/

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

// Export the utility functions
export { slugify, generateUniqueSlug }