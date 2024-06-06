/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 06/06/2024
A component to display the recipe categories on the home page
*/

// Import the Fragment component from React
import { Fragment } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the icons for the recipe categories
import BreakfastIcon from '../../../public/icons/brekfast.svg';
import LunchIcon from '../../../public/icons/lunch.svg';
import DinnerIcon from '../../../public/icons/dinner.svg';
import SnacksIcon from '../../../public/icons/snacks.svg';

// Define the icons for the recipe categories
const categoryIcons = {
  breakfast: BreakfastIcon, // Define the icon for the breakfast category
  lunch: LunchIcon, // Define the icon for the lunch category
  dinner: DinnerIcon, // Define the icon for the dinner category
  snacks: SnacksIcon, // Define the icon for the snacks category
};

/**
 * Categories component to display the recipe categories on the home page.
 * @param {array} categories - the list of recipe categories
 * @returns {JSX.Element} - the recipe categories component
 */
const RecipeCategories = ({ categories }) => {
  // Return the recipe categories component
  return (
    <Fragment>
    {/* Display the recipe categories */}
      <div className="mt-8">
        {/* Display the heading for the recipe categories */}
        <h2 className="text-2xl font-bold mb-4">Browse Recipe Categories</h2>
        {/* Display the grid of recipe categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Map over the recipe categories and display each category */}
            {categories.map(category => {
            // Get the icon for the category
            const Icon = categoryIcons[category.slug];
            // Return the category link
            return (
                <Link href={`/recipes/${category.slug}`} key={category.slug} className="block p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-200 text-center">
                    {Icon && <Icon className="w-12 h-12 mx-auto mb-2" />}
                    <span className="block text-lg font-semibold">{category.name}</span>
                </Link>
            );
            })}
          </div>
        </div>
    </Fragment>
  );
};

// Validate the categories prop
RecipeCategories.propTypes = { 
  categories: PropTypes.arrayOf(PropTypes.shape({ // Validate the categories array
    name: PropTypes.string.isRequired, // Validate the name property
    slug: PropTypes.string.isRequired, // Validate the slug property
  })).isRequired, // The categories array is required
};

// Export the Categories component
export default RecipeCategories;
