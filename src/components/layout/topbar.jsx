import { useState } from 'react';
import Link from 'next/link';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import styles from '../../styles/scss/components/layout/topbar.module.scss';

const TopBar = ({ onSearch, onToggleTheme, isDarkMode }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search Recipes"
                    className="p-2 rounded-l border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0.5 focus:ring-primary focus:border-gray-600"
                />
                <button type="submit" className="p-2 bg-gray-400 text-white rounded-r border border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:bg-gray-600">
                    Search
                </button>
            </form>
            <div className="flex items-center">
                <Link href="/recipes/new" className="ml-4 bg-primary hover:bg-tertiary text-white px-4 py-2 rounded">+ New Recipe</Link>
                <button
                    onClick={onToggleTheme}
                    className="ml-4 p-2 rounded-full bg-gray-300 dark:bg-gray-800"
                >
                    {isDarkMode ? (
                        <SunIcon className={`w-6 h-6 ${styles.sparkle} ${styles.sparkleSun}`} />
                    ) : (
                        <MoonIcon className={`w-6 h-6 ${styles.sparkle} ${styles.sparkleMoon}`} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default TopBar;
