/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 29/05/2024
A helper function to authenticate the user session in the API routes.
*/

// Import the getSession function from next-auth/react
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

// Define the authenticate middleware function
const authenticate = async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    /*
    Authenticate the user session in the API routes.
    Parameters:
    - req: the request object from the API route
    */
    // Get the user session from the request
    if (session) {
        // If yes, set the user in the request object
        req.user = session.user;
    } else {
        // If no, Set the user as null in the request object
        req.user = null;
    }
    console.log(req.user);
};

// Export the authenticate middleware function
export default authenticate;
