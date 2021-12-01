import React from "react";
import "../styles/global.css";

const Layout: React.FC = (props) =>
    <div className="layout">
        <div className="content">
            {props.children}
        </div>
        <footer>
            <p>Copyright 2021 Christopher Besch</p>
        </footer>
    </div>;
export default Layout;
