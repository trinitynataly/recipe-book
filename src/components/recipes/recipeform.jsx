/*
Version: 1.8
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A recipe form component for creating and updating recipes.
*/

// Import the Fragment component and useState hook from React
import { Fragment, useState } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the dynamic function from Next.js for dynamic imports
import dynamic from 'next/dynamic';
// Dunamicly import the ReactQuill component for rich text editing
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// Import the Quill styles for rich text editing
import 'react-quill/dist/quill.snow.css';

/**
 * RecipeForm component to create and update recipes with title, description, ingredients, cook time, instructions, tags, and type.
 * RecipeForm component properties:
 * @param onSubmit: the function to submit the recipe form
 * @param initialData: the initial recipe data for update
 * @param submitButtonText: the text for the submit button
 * @returns the recipe form with title, description, ingredients, cook time, instructions, tags, and type
 */
const RecipeForm = ({ onSubmit, initialData = {}, submitButtonText = 'Submit' }) => {
  // Define the state for the title
  const [title, setTitle] = useState(initialData.title || '');
  // Define the state for the description
  const [description, setDescription] = useState(initialData.description || '');
  // Define the state for the ingredients
  const [ingredients, setIngredients] = useState(initialData.ingredients ? initialData.ingredients : '');
  // Define the state for the cook time
  const [cookTime, setCookTime] = useState(initialData.cook_time || '');
  // Define the state for the instructions
  const [instructions, setInstructions] = useState(initialData.instructions || '');
  // Define the state for the tags
  const [tags, setTags] = useState(initialData.tags ? initialData.tags.map(tag => tag.name).join(', ') : '');
  // Define the state for the type
  const [type, setType] = useState(initialData.type || 'Breakfast');

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    // Prevent the default form submission
    e.preventDefault();
    // Create the form data object
    const formData = {
        title, // Title of the recipe
        description, // Description of the recipe
        ingredients, // Ingredients of the recipe
        cook_time: cookTime, // Cook time of the recipe
        instructions, // Instructions of the recipe
        tags: tags.split(','), // Tags of the recipe
        type // Type of the recipe
    };
    // Call the onSubmit function with the form data
    await onSubmit(formData);
  };

  return (
    <Fragment>
      {/* Recipe form with title, description, ingredients, cook time, instructions, tags, and type */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
        {/* Title of the recipe form */}
        <h1 className="text-2xl font-bold mb-4">{initialData._id ? 'Update Recipe' : 'Create New Recipe'}</h1>
        {/* Title input field */}
        <div className="mb-4">
          {/* Label for the title input field */}
          <label htmlFor="title" className="block text-gray-700">Title</label>
          {/* Input field for the title */}
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* Description input field */}
        <div className="mb-4">
          {/* Label for the description input field */}
          <label htmlFor="description" className="block text-gray-700">Description</label>
          {/* Textarea for the description */}
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* Type select field */}
        <div className="mb-4">
        {/* Label for the type select field */}  
          <label htmlFor="type" className="block text-gray-700">Type</label>
          {/* Select field for the type */}
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
          </select>
        </div>
        {/* Cook time input field */}
        <div className="mb-4">
          {/* Label for the cook time input field */}
          <label htmlFor="cook_time" className="block text-gray-700">Cook Time (minutes)</label>
          {/* Input field for the cook time, numbers only */}
          <input
            type="number"
            id="cook_time"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* Ingredients rich text editor */}
        <div className="mb-4">
          {/* Label for the ingredients rich text editor */}
          <label htmlFor="ingredients" className="block text-gray-700">Ingredients</label>
          {/* Rich text editor for the ingredients */}
          <ReactQuill
            value={ingredients}
            onChange={setIngredients}
            theme="snow"
            className="h-96"
          />
        </div>
        {/* Instructions rich text editor */}
        <div className="mb-4">
          {/* Label for the instructions rich text editor */}
          <label htmlFor="instructions" className="block text-gray-700">Instructions</label>
          <ReactQuill
            value={instructions}
            onChange={setInstructions}
            theme="snow"
            className="h-96"
          />
        </div>
        {/* Tags input field */}
        <div className="mb-4">
          {/* Label for the tags input field */}
          <label htmlFor="tags" className="block text-gray-700">Tags (comma separated)</label>
          {/* Input field for the tags */}
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Submit button */}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{submitButtonText}</button>
      </form>
    </Fragment>
  );
};

// Validate the RecipeForm component properties
RecipeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Function to submit the recipe form
  initialData: PropTypes.object, // Initial recipe data for update (empty to create new recipe)
  submitButtonText: PropTypes.string // Text for the submit button
};

// Export the RecipeForm component
export default RecipeForm;
