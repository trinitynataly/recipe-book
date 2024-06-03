/*
Version: 1.8
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
Register page for new user registration
*/

// Import the Fragment component and useState hook from React
import { Fragment, useState } from "react";
// Import the useRouter hook from Next.js for routing
import { useRouter } from 'next/router';
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the Logo component from the public folder
import Logo from '../../public/recipe_book_logo.svg';
// Import the Joi library for validation
import Joi from 'joi';
// Import the axios library for making HTTP requests
import axios from 'axios';
// Import the signIn function from the next-auth/react library
import { signIn } from 'next-auth/react';

/**
 * Register component to display a registration form.
 * @returns {JSX.Element}
 */
export default function Register() {
  // Define the state variables for the form fields
  const [firstName, setFirstName] = useState('');
  // Define the last name state variable
  const [lastName, setLastName] = useState('');
  // Define the email state variable
  const [email, setEmail] = useState('');
  // Define the password state variable
  const [password, setPassword] = useState('');
  // Define the confirm password state variable
  const [confirmPassword, setConfirmPassword] = useState('');
  // Define the error state variable
  const [error, setError] = useState('');
  // Define the success state variable
  const [success, setSuccess] = useState('');
  // Get the router object
  const router = useRouter();

  // Define the schema for form validation
  const schema = Joi.object({
    // First name field
    firstName: Joi.string().min(1).required().messages({
      'string.empty': 'First name is required',
      'any.required': 'First name is required'
    }),
    // Last name field
    lastName: Joi.string().min(1).required().messages({
      'string.empty': 'Last name is required',
      'any.required': 'Last name is required'
    }),
    // Email field
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.email': 'Email must be a valid email',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
    // Password field
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
    // Confirm password field
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords must match',
      'any.required': 'Confirm password is required'
    })
  });

  // Handle the form submission
  const handleSubmit = async (event) => {
    // Prevent the default form submission
    event.preventDefault();
    // Reset the error and success messages
    setError('');
    setSuccess('');

    // Validate the form fields
    const { error: validationError } = schema.validate({ firstName, lastName, email, password, confirmPassword });

    // Check if there are any validation errors
    if (validationError) {
      // Set the error message if there are validation errors
      setError(validationError.details[0].message);
      // Return to stop the form submission
      return;
    }

    try {
      // Convert the email to lowercase
      const lowerCaseEmail = email.toLowerCase();
        // Make a POST request to the API to register the user
      const response = await axios.post('/api/auth/register', {
        firstName, // Supply first name
        lastName, // Supply last name
        email: lowerCaseEmail, // Supply email
        password, // Supply password
      });
      // Check if the registration was successful
      if (response.status === 201) {
        // Set the success message
        setSuccess('Registration successful! Redirecting to home...');
        // Auto-authenticate the user
        const res = await signIn('credentials', { redirect: false, email: lowerCaseEmail, password });
        // Check if the authentication was successful
        if (!res.error) {
          // Redirect to the home page
          router.push('/');
        } else {
          // Set the error message if the authentication failed
          setError('Authentication failed after registration. Please log in manually.');
        }
      } else {
        // Set the error message if the registration failed
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      // Set the error message if there was an error with the request
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>Register new account | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="Register new account to access the portal..." />
      </Head>
      {/* Register page container */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Register form block */}
        <div className="max-w-md w-full space-y-8">
          {/* Logo and title */}
          <div>
            {/* Logo with link */}
            <Link href="/" passHref>
              <Logo className="text-gray-900" />
            </Link>
            {/* Register form title */}
            <h2 className="mt-6 text-center text-3xl font-medium text-gray-600">
              Create your account
            </h2>
            {/* Error and success messages */}
            {error && <p className="text-center text-red-500">{error}</p>}
            {success && <p className="text-center text-green-500">{success}</p>}
          </div>
          {/* Register form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              {/* First name input */}
              <div>
                <label htmlFor="first-name" className="sr-only">First Name</label>
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              {/* Last name input */}
              <div>
                <label htmlFor="last-name" className="sr-only">Last Name</label>
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              {/* Email address input */}
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Password input */}
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* Confirm password input */}
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            {/* Register button */}
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-tertiary focus:bg-tertiary bg-primary">
                Register new account
              </button>
            </div>
          </form>
          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link href="/login" className="text-gray-600 hover:text-tertiary">
                Already have an account? Click here!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
