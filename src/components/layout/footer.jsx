import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full py-4 bg-gray-800 text-gray-400 text-center mt-auto">
            <div className="container mx-auto px-4">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Recipe Book. All rights reserved. | 
                    <Link href="/privacy-policy" className="text-gray-300 hover:underline ml-2">Privacy Policy</Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
