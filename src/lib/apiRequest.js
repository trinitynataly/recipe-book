/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 29/05/2024
A helper function to make API requests to the server API with Axios.
*/

// Import Axios for making HTTP requests
import axios from 'axios';

// Define the base URL for the API
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Define the API request function
const apiRequest = async (endpoint, method = 'GET', data = null, context = null) => {
    /*
    Make an API request to the server API using Axios.
    Parameters:
    - endpoint: the API endpoint to call
    - method: the HTTP method to use (default is GET)
    - data: the data to send with the request (default is null)
    - context: the context object from getServerSideProps (default is null)
    */
    // Construct the full URL for the API request
    let url = `${BASE_URL}/api/${endpoint}`;
    // Set the headers for the request
    const headers = {};

    // Conditionally set Content-Type header based on the request data type (JSON or FormData) and method
    if (method !== 'GET' && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Use context to get cookies for server-side requests (SSR) to authenticate the user
    if (context && context.req) {
        headers['Cookie'] = context.req.headers.cookie;
    }

    // Serialize data for GET requests and append to the URL
    if (method === 'GET' && data) {
        // Convert data object to URL-encoded query string
        const params = new URLSearchParams(data).toString();
        // Append query string to the URL
        url += `?${params}`;
    }

    // Make the API request using Axios
    try {
        // Send the request to the server API
        const response = await axios({
            url, // Full URL for the API request
            method, // HTTP method (GET, POST, PUT, DELETE)
            headers, // Request headers
            data: method === 'GET' ? null : data, // Do not include data in the body for GET requests
            withCredentials: true, // Send cookies with the request for authentication
        });
        return response.data; // Return the API response data
    } catch (error) {
        // Handle any errors that occur during the API request
        console.error('API request error:', error.response ? error.response.data : error.message);
        // Return an error response
        return {
            success: false, // Indicate that the request was not successful
            message: error.response ? error.response.data.message : 'API request error', // Error message
        };
    }
};

// Export the API request function
export default apiRequest;
