/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
Google Analytics tracking code embedding functions
*/

// Define the Google Analytics tracking ID from the environment variables
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

// Define a function to log page views
const pageview = (url) => {
  /**
   * Function to log a page view in Google Analytics
   * @param url - The URL of the page to track
   */
  // Log the page view with the URL
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url, // The URL of the page
  });
};

// Define a function to log events
const event = ({ action, category, label, value }) => {
  /**
   * Function to log an event in Google Analytics
   * @param action - The action to track
   * @param category - The category of the action
   * @param label - The label for the action
   * @param value - The value to assign to the action
   */
  // Log the event with the action, category, label, and value
  window.gtag('event', action, {
    event_category: category, // The category of the event
    event_label: label, // The label for the event
    value: value, // The value to assign to the event
  });
};

// Export the pageview and event functions for use in the application
export { GA_TRACKING_ID, pageview, event };