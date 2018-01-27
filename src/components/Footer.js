import React from 'react';
import {Link} from 'react-router-dom';

export const Footer = () => (
    <footer className="footer">
        <div className="content-container">
            <div className="footer__content">
                <Link to="/updates" >
                    [ Recent app updates / bug fixes ]
                </Link>
            </div>
        </div>
    </footer>
);


export default Footer;