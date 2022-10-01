import React from "react";
import Layout from "src/components/layout";
import * as styles from "src/styles/rocket.module.scss";
const Rocket = ({}) => {
    return (React.createElement(Layout, { heading: "About" },
        React.createElement("div", { className: styles.container },
            React.createElement("p", { className: styles.left }, "Twenty seconds and counting."),
            React.createElement("p", { className: styles.right }, "I'm a problem solver. Solving problems because we can is amazing, but what really catches my motivation is a user who's life I can improve."),
            React.createElement("p", { className: styles.left }, "T minus 15 seconds, guidance is internal."),
            React.createElement("p", { className: styles.right }, "The bigger the project, the better; even if it doesn't quite suit my taste. I don't mind dedicating all my work to the handle of the door to the cockpit of a spacecraft."),
            React.createElement("p", { className: styles.left }, "12, 11, 10, 9, ignition sequence start..."),
            React.createElement("p", { className: styles.right }, "When I'm doing my part and others can rely on what I've built, I feel fulfilled. After all I'm using other people's work for my own foundation."),
            React.createElement("p", { className: styles.left }, "...6, 5, 4, 3..."),
            React.createElement("p", { className: styles.right }, "I like people\u2014people are great! Whenever possible I work in a team, solving even bigger problems."),
            React.createElement("p", { className: styles.left }, "...2, 1, zero, all engine running..."),
            React.createElement("p", { className: styles.right }, "When it comes to taste, I prefer the Terminal over a GUI, VIM over huge IDEs, backend over frontend, C++ over Python and Linux over Windows. But those are justs that\u2014tastes. When it's absolutely required to work with Visual Studio Code on a frontend for Windows in HTML, I bite the bullet and do it."),
            React.createElement("p", { className: styles.left }, "LIFT-OFF! We have a lift-off, 32 minutes past the hour. Lift-off on Apollo 11."),
            React.createElement("p", { className: styles.right }, "Have a nice day."))));
};
export default Rocket;
