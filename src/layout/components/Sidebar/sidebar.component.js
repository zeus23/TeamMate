import React, { use } from 'react';

import './sidebar.style.css';

import { MdDashboard } from 'react-icons/md'
import { HiOutlineTemplate } from 'react-icons/hi'
import { IoEarth } from 'react-icons/io5'

const Sidebar = (props) => {
    return (
        <div className="sidebar-container">
            <div className={props.page === '/home' ? "sidebar-menu active" : "sidebar-menu"} onClick={() => window.location.href = "/home"}>
                <IoEarth color={props.page === '/home' ? "#404BC5" : "#414141"} />
                <p>Home</p>
            </div>
            <div className={props.page.includes('/boards') ? "sidebar-menu active" : "sidebar-menu"} onClick={() => window.location.href = props.currentUserEmail + "/boards"}>
                <MdDashboard color="#414141" />
                <p>Boards</p>
            </div>
            <div className={props.page === '/templates' ? "sidebar-menu active" : "sidebar-menu"} onClick={() => window.location.href = "/templates"}>
                <HiOutlineTemplate color={props.page === '/templates' ? "#404BC5" : "#414141"} />
                <p>Templates</p>
            </div>
        </div>
    )
}

export default Sidebar;
