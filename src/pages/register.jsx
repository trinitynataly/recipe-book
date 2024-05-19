import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Logo from '../../public/recipe_book_logo.svg';
import Joi from 'joi';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');  // State to hold error message
  const [success, setSuccess] = useState('');  // State to hold success message
  const router = useRouter();  // Next.js router to handle redirection

  useEffect(() => {
    // Set state with autofilled values when component mounts
    setFirstName(document.getElementById('first-name')?.value || '');
    setLastName(document.getElementById('last-name')?.value || '');
    setEmail(document.getElementById('email-address')?.value || '');
    setPassword(document.getElementById('password')?.value || '');
    setConfirmPassword(document.getElementById('confirm-password')?.value || '');
  }, []);

  const schema = Joi.object({
    firstName: Joi.string().min(1).required().messages({
      'string.empty': 'First name is required',
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().min(1).required().messages({
      'string.empty': 'Last name is required',
      'any.required': 'Last name is required'
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.email': 'Email must be a valid email',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords must match',
      'any.required': 'Confirm password is required'
    })
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');  // Reset error message on new submission
    setSuccess(''); // Reset success message on new submission

    const { error: validationError } = schema.validate({ firstName, lastName, email, password, confirmPassword });

    if (validationError) {
      setError(validationError.details[0].message);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');  // Use server-side error message if available
      }

      // Save the tokens to localStorage
      localStorage.setItem('access_token', data.tokens.access_token);
      localStorage.setItem('refresh_token', data.tokens.refresh_token);

      setSuccess('Registration successful! Redirecting to home...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Register new account | Recipe Book</title>
        <meta name="description" content="Register new account to access the portal..." />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link href="/" passHref className="text-gray-900">
              <Logo className="text-gray-900" />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-medium text-gray-600">
              Create your account
            </h2>
            {error && <p className="text-center text-red-500">{error}</p>}  {/* Display error message if there is one */}
            {success && <p className="text-center text-green-500">{success}</p>}  {/* Display success message if there is one */}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
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

            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-tertiary focus:bg-tertiary bg-primary">
                Register new account
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link href="/login" passHref className="text-gray-600 hover:text-tertiary">
                Already have an account? Click here!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
