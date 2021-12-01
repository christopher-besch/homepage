import React from "react";
import Navbar from "./navbar";
import "../styles/global.css";

// from https://ozantunca.org/the-right-way-to-type-function-components-in-react-with-typescript
const Layout: React.FC = (props) =>
    <div className="layout">
        <Navbar />
        <div className="content">
            {props.children}
        </div>
        <footer>
            <p>Copyright 2021 stuff</p>
        </footer>
    </div>;
export default Layout;
