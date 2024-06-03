/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
Google Analytics tracking code embedding functions
*/

// Define the Google Analytics tracking ID from the environment variables
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

/**
 * Function to log a page view in Google Analytics
 * @param {string} url - The URL of the page to track
 * @returns {void}
 */
const pageview = (url) => {
  // Log the page view with the URL
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url, // The URL of the page
  });
};

/**
 * Function to log an event in Google Analytics
 * @param {string} action - The action to track
 * @param {string} category - The category of the event
 * @param {string} label - The label for the event
 * @param {number} value - The value to assign to the event
 * @returns {void}
 */
const event = ({ action, category, label, value }) => {
  // Log the event with the action, category, label, and value
  window.gtag('event', action, {
    event_category: category, // The category of the event
    event_label: label, // The label for the event
    value: value, // The value to assign to the event
  });
};

// Export the pageview and event functions for use in the application
export { GA_TRACKING_ID, pageview, event };