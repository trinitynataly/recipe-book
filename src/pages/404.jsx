import Link from 'next/link';
import Logo from '../../public/recipe_book_logo.svg';

export default function Error404() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Link href="/" passHref>
            <Logo className="mx-auto h-12 w-auto" />
          </Link>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900">404 - Page Not Found</h1>
          <p className="mt-2 text-base text-gray-600">Sorry, the page you are looking for does not exist.</p>
        </div>
        <div>
          <Link href="/" passHref>
            <button className="mt-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Go back home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
