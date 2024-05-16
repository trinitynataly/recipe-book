import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuMenuSquare } from 'react-icons/lu';
import Logo from '../../../public/recipe_book_logo.svg';
import SidebarItem from './sidebaritem';

function Sidebar({ items }) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setIsMobile(true);
        setMenuVisible(false);
      } else {
        setIsMobile(false);
        setMenuVisible(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function toggleSidebar() {
    if (isMobile) {
      setMenuVisible(!menuVisible);
    }
  }

  return (
    <aside id="sidebar" className={`bg-primary text-white relative ${isMobile ? 'h-16 w-screen' : 'w-80 h-screen'}`}>
      <nav className={`${isMobile ? 'flex-row justify-between items-center' : 'flex-col h-full justify-between items-center'}`}>
        <div className="p-4 pb-2 flex justify-between items-center">
          <Link href="/" passHref>
            <Logo className="w-48" />
          </Link>
          <button onClick={toggleSidebar} className={`z-20 ${isMobile ? '' : 'hidden'}`}>
            <LuMenuSquare style={{ fontSize: '2em' }} />
          </button>
        </div>
        <ul className={`bg-primary flex-1 px-3 ${isMobile ? (menuVisible ? 'block' : 'hidden') : 'block'}`}>
          {items.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              text={item.text}
              href={item.href}
              submenu={item.submenu}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
