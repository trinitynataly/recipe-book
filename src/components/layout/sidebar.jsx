import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuMenuSquare } from 'react-icons/lu';
import Logo from '../../../public/recipe_book_logo.svg';
import SidebarItem from './sidebaritem';

function Sidebar({ items, isMobile }) {

    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
      setMenuVisible(!isMobile);
    }, [isMobile]);

    function toggleSidebar() {
        if (isMobile) {
            setMenuVisible(!menuVisible);
        }
    }

    return (
        <aside id="sidebar" className={`bg-sidebarBg dark:bg-darkSidebarBg text-sidebarText ${isMobile ? 'relative h-16 w-screen' : 'fixed top-0 left-0 w-80 h-screen overflow-y-auto h-screen'}`}>
            <nav className={`${isMobile ? 'flex-row justify-between items-center' : 'flex-col h-full justify-between items-center'}`}>
                <div className="p-4 pb-2 flex justify-between items-center">
                    <Link href="/" passHref>
                        <Logo className="w-48" />
                    </Link>
                    <button onClick={toggleSidebar} className={`z-20 ${isMobile ? '' : 'hidden'}`}>
                        <LuMenuSquare style={{ fontSize: '2em' }} />
                    </button>
                </div>
                <ul className={`bg-sidebarBg dark:bg-darkSidebarBg flex-1 px-3 ${isMobile ? (menuVisible ? 'block z-50 absolute w-full' : 'hidden') : 'block'}`}>
                    {items.map((item, index) => (
                        <SidebarItem key={index} icon={item.icon} text={item.text} href={item.href} submenu={item.submenu} />
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
