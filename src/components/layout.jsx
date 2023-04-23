import * as React from 'react';
import { Link } from 'gatsby';
import * as layoutStyles from './layout.module.css';


const Layout = ({ children }) => {
    return (
        <div className={layoutStyles.container}>
            <header className={layoutStyles.header}>
                <h1>Assignment 5: Birds of Wingspan</h1>
                <nav> 
                    <ul className={layoutStyles.navList}>
                        <li className={layoutStyles.navItem}> 
                            <Link to='/'>Home</Link>
                        </li>
                        <li className={layoutStyles.navItem}>
                            <Link to='/birds'>Birds</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer>
            This product uses the Flickr API but is not endorsed or certified by SmugMug, Inc.
            </footer>
        </div>
    );
};

export default Layout;
