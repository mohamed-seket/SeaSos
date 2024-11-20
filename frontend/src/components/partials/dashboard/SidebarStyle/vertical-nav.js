import React, { memo, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';

const VerticalNav = memo(() => {
    let location = useLocation();
    return (
        <Fragment>
            <Accordion as="ul" className="navbar-nav iq-main-menu">
                <li className="nav-item static-item">
                    <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                        <span className="default-icon">Home</span>
                        <span className="mini-icon">-</span>
                    </Link>
                </li>
                <li className={`${location.pathname === '/dashboard' ? 'active' : ''} nav-item`}>
                    <Link className="nav-link" aria-current="page" to="/dashboard">
                        <i className="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3h8v8H3V3zM13 3h8v5h-8V3zM13 10h8v8h-8v-8zM3 13h8v8H3v-8z" fill="currentColor"></path>
                            </svg>
                        </i>
                        <span className="item-name">Dashboard</span>
                    </Link>
                </li>
                <li className={`${location.pathname === '/' ? 'active' : ''} nav-item`}>
                    <Link className="nav-link" aria-current="page" to="/">
                        <i className="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 12-7 12s-7-6.75-7-12a7 7 0 0 1 7-7zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="currentColor"></path>
                            </svg>
                        </i>
                        <span className="item-name">Map</span>
                    </Link>
                </li>
                <li className={`${location.pathname === '/user-list' ? 'active' : ''} nav-item`}>
                    <Link className="nav-link" aria-current="page" to="/user-list">
                        <i className="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 12c2.21 0 4 1.79 4 4v1h-8v-1c0-2.21 1.79-4 4-4zm-8 0c2.21 0 4 1.79 4 4v1H4v-1c0-2.21 1.79-4 4-4zm0-6a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm8 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="currentColor"></path>
                            </svg>
                        </i>
                        <span className="item-name">Operations center</span>
                    </Link>
                </li>
                <li className={`${location.pathname === '/patrol-list' ? 'active' : ''} nav-item`}>
                    <Link className="nav-link" aria-current="page" to="/patrol-list">
                        <i className="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2l9 4v5c0 6-4.5 11-9 11S3 17 3 11V6l9-4z" fill="currentColor"></path>
                            </svg>
                        </i>
                        <span className="item-name">Patrols</span>
                    </Link>
                </li>
                <li className={`${location.pathname === '/boat-list' ? 'active' : ''} nav-item`}>
                    <Link className="nav-link" aria-current="page" to="/boat-list">
                        <i className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="5" r="3"></circle>
                                <line x1="12" y1="22" x2="12" y2="8"></line>
                                <path d="M5 12H2c0 5 3.6 9 8 9s8-4 8-9h-3"></path>
                            </svg>
                        </i>
                        <span className="item-name">Boats</span>
                    </Link>
                </li>
                <li className={`${location.pathname === '/enclosed-missions-history' ? 'active' : ''} nav-item`}>
                    <Link className="nav-link" aria-current="page" to="/enclosed-missions-history">
                        <i className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0z"/>
  <path d="M8.93 6.588l-2.83 2.829.707.707 2.829-2.829-.707-.707zM7 8.5A1.5 1.5 0 1 1 5.5 7 1.5 1.5 0 0 1 7 8.5z"/>
  <path fill-rule="evenodd" d="M7.5 2v1h1V2h-1zM2 8.5h1v-1H2v1zm12 0h1v-1h-1v1zm-5.5 6v1h1v-1h-1zm-2.354-1.646l-.707.707 1 1 .707-.707-1-1zm9-9l.707.707 1-1-.707-.707-1 1zM2.646 13.354l.707.707 1-1-.707-.707-1 1zM13.354 2.646l.707.707 1-1-.707-.707-1 1z"/>
</svg>




                        </i>
                        <span className="item-name">Missions History</span>
                    </Link>
                </li>
            </Accordion>
        </Fragment>
    )
})

export default VerticalNav;
