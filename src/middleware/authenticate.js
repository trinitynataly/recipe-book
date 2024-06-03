/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
A helper function to authenticate the user session in the API routes.
*/

// Import the authOptions object from the next-auth configuration
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// Import the getServerSession function from next-auth/next
import { getServerSession } from "next-auth/next";

/**
 * Middleware function to authenticate the user session in the API routes and add the user to the request object.
 * @param req - the request object
 * @param res - the response object
 * @returns {void}
 */
const authenticate = async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    // Get the user session from the request
    if (session) {
        // If yes, set the user in the request object
        req.user = session.user;
    } else {
        // If no, Set the user as null in the request object
        req.user = null;
    }
};

// Export the authenticate middleware function
export default authenticate;
