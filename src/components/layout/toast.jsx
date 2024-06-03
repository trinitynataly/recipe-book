/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A toast component for the application layout displaying the notification message.
*/

// Import the Fragment component from React
import { Fragment } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';

/**
 * Toast component to display the notification message with title and text.
 * Toast component properties:
 * @param {string} title - the title of the notification message
 * @param {string} text - the text of the notification message
 * @param {string} type - the type of the notification message
 * @returns {JSX.Element} - the notification message with title and text
 */

const Toast = ({ title, text, type }) => {
  // Define the notification message styles based on the type
  const typeStyles = {
    confirm: 'bg-green-500', // Green background for confirmation message
    warn: 'bg-yellow-500', // Yellow background for warning message
    error: 'bg-red-500', // Red background for error message
  };

  // Return the notification message with title and text
  return (
    <Fragment>
      {/* Notification message with title and text */}
      <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${typeStyles[type]} text-white`}>
        {/* Title of the notification message */}
        <strong>{title}</strong>
        {/* Text of the notification message */}
        <p>{text}</p>
      </div>
    </Fragment>
  );
};

// Validate the Toast component properties
Toast.propTypes = {
  title: PropTypes.string.isRequired, // Title of the notification message
  text: PropTypes.string.isRequired, // Text of the notification message
  type: PropTypes.oneOf(['confirm', 'warn', 'error']).isRequired, // Type of the notification message
};

// Export the Toast component
export default Toast;
