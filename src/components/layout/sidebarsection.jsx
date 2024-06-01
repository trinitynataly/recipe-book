import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from 'next/router';
import SidebarItem from './sidebaritem';

function SidebarSection({ icon, text, submenu, href }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        if (submenu) {
            const isActive = submenu.some(item => router.asPath.includes(item.href));
            setIsOpen(isActive);
        }
    }, [router.asPath, submenu]);

    const toggleSubmenu = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const isActive = (path, isParent= true) =>{
        if (isParent) {
            return router.asPath === path;
        } else {
            return router.asPath.includes(path);
        }
    };

    const getParentStyle = (href) => {
        if (isOpen) {
            return 'bg-red-700 text-white';
        } else {
            return isActive(href) ? 'bg-red-600 text-white' : '';
        }
    }

    return (
        <li className={`sidebar-row group flex flex-col items-start py-2 px-3 my-1 rounded-md hover:bg-red-700 transition-colors cursor-pointer  ${getParentStyle(href)}`}>
            <Link href={href?href:"#"} passHref className="w-full sidebar-item">
                <SidebarItem icon={icon} text={text} submenu={submenu} isOpen={isOpen} toggleSubmenu={toggleSubmenu} />
            </Link>
            {isOpen && submenu && (
                <ul className="aside-item-child w-full pl-2 pt-4">
                    {submenu.map((item, index) => (
                        <li key={index} className={`sidebar-item py-1 pl-4 rounded-md flex items-center hover:bg-red-600 ${isActive(item.href, false) ? 'bg-red-600 text-white' : ''}`}>
                            <Link href={item.href} passHref className="w-full">
                                <SidebarItem icon={item.icon} text={item.text}/>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}

export default SidebarSection;
