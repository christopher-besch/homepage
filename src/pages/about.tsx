import React from "react";
import Layout from "src/components/layout";
import * as styles from "src/styles/about.module.scss";

const About: React.FC = (props) => {
    return (
        <Layout heading="About">
            <div className={styles.container}>
                <p className={styles.left}>Twenty seconds and counting.</p>
                <p className={styles.right}>
                    I'm a problem solver.
                    Solving problems because we can is amazing, but what really catches my motivation is a user in need&mdash;someone who's problem I can solve.
                </p>
                <p className={styles.left}>T minus 15 seconds, guidance is internal.</p>
                <p className={styles.right}>
                    The bigger the project, the better; even if it doesn't quite suit my taste.
                    I don't mind dedicating all my work on the handle of the door to the cockpit of a spacecraft.
                </p>
                <p className={styles.left}>12, 11, 10, 9, ignition sequence start...</p>
                <p className={styles.right}>
                    When I'm doing my part and others can rely on what I've built, I don't feel so bad for using other people's work as my own foundation.
                </p>
                <p className={styles.left}>...6, 5, 4, 3...</p>
                <p className={styles.right}>
                    I like people&mdash;a lot.
                    Whenever possible I work in a team, solving even bigger problems.
                </p>
                <p className={styles.left}>...2, 1, zero, all engine running...</p>
                <p className={styles.right}>
                    When it comes to taste, I prefer the Terminal over a GUI, VIM over huge IDEs, backend over frontend, C++ over Python and Linux over Windows.
                    But those are justs that&mdash;tastes.
                    When it's absolutely required to work with Visual Studio Code on a frontend for Windows in HTML, I bite the bullet and do it.
                </p>
                <p className={styles.left}>LIFT-OFF! We have a lift-off, 32 minutes past the hour. Lift-off on Apollo 11.</p>
                <p className={styles.right}>
                    Have a nice day.
                </p>
            </div>
        </Layout>
    );
};
export default About;
