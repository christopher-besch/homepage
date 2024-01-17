import React from "react";
import { Link, graphql, PageProps } from "gatsby";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import SubHeading from "src/components/sub_heading";
import * as styles from "src/styles/about.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import get_mask from "src/utils/svg_mask";

const About = ({ data }: PageProps<Queries.AboutQuery>) => {
    const email_name = data.site?.siteMetadata?.email?.name as string;
    const email_link = data.site?.siteMetadata?.email?.link as string;

    const github_name = data.site?.siteMetadata?.github?.name as string;
    const github_link = data.site?.siteMetadata?.github?.link as string;

    let width_properties = {
        "--full-width": "100%",
        "--half-width": "100%",
        "--quarter-width": "100%",
    } as React.CSSProperties;
    return (
        <Layout heading="About & Contact">
            <div className={styles.container}>
                <div className={styles.rocket}>
                    <div className={styles.rocket_elements}>
                        <p className={styles.left}>Twenty seconds and counting.</p>
                        <p className={styles.right}>
                            I'm a problem solver.
                            Solving problems because we can is amazing, but what really catches my motivation is a user who's life I can improve.
                        </p>
                        <p className={styles.left}>T minus 15 seconds, guidance is internal.</p>
                        <p className={styles.right}>
                            The bigger the project, the better; even if it doesn't quite suit my taste.
                            I don't mind dedicating all my work to the handle of the door to the cockpit of a spacecraft.
                        </p>
                        <p className={styles.left}>12, 11, 10, 9, ignition sequence start...</p>
                        <p className={styles.right}>
                            When I'm doing my part and others can rely on what I've built, I feel fulfilled.
                            After all I'm using other people's work for my own foundation.
                        </p>
                        <p className={styles.left}>...6, 5, 4, 3...</p>
                        <p className={styles.right}>
                            I like people&mdash;people are great!
                            Whenever possible I work in a team, solving even bigger problems.
                        </p>
                        <p className={styles.left}>...2, 1, zero, all engine running...</p>
                        <p className={styles.right}>
                            When it comes to taste, I prefer the Terminal over a GUI, VIM over huge IDEs, backend over frontend, C++ over Python and Linux over Windows.
                            But those are just that&mdash;tastes.
                            When it's absolutely required to work with Visual Studio Code on a frontend for Windows in HTML, I bite the bullet and do it.
                        </p>
                        <p className={styles.left}>LIFT-OFF! We have a lift-off, 32 minutes past the hour. Lift-off on Apollo 11.</p>
                        <p className={styles.right}>
                            Have a nice day.
                        </p>
                    </div>
                </div>

                <div className={styles.contacts}>
                    <a href={email_link} target="_blank" className={styles.contact} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/email-svgrepo-com.svg")}></span>
                            <hr />
                            <h3>{email_name}</h3>
                        </div>
                    </a>
                    <a href={github_link} target="_blank" className={styles.contact} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/github.svg")}></span>
                            <hr />
                            <h3>{github_name}</h3>
                        </div>
                    </a>
                    <div className={styles.pgp_container}>
                        <pre className={styles.pgp}>
                            -----BEGIN PGP PUBLIC KEY BLOCK-----<br />
                            <br />
                            xsFNBGWnpYMBEAC9d27EGVW4xcGJpFpfNNd0i9pFoUJ96m1gEPpV+yL/6KRz5ZCI<br />
                            ws17XHVAhmBhGBdAO2yk9ynKPI/x/TqV4vCNLdLa4j2lOAneQnwvBx+ORwzkqs9S<br />
                            PiW9/5ufGlSfJBHIFTEQQ1R9NIBm74MiBQm1zAbNspfPCvrI2Yp3VY7KFhEmZWpx<br />
                            t+Gvpho+rpqDeZl1VLDIPDcNfzzXQ/N24rNXcKLtHL6iZ0WYbQilT4Qv2CQd0cM8<br />
                            KX93HTQwjXIJruXHHG2GBpKqMo+e4ZH9XAnVctMNUwmtQH4Lrxm+518308obhmlt<br />
                            ubyLofJN9BikGgghNxFOMros2/W1px8FZuGDTypeDgwjjMxSUgJOW4rOCOzNznfA<br />
                            4aUdH3aPuZf3FIs1cwAMZ2p9psABVaHJSY/xSoaYrYcQKDkCMoBL3viBTQmHgqki<br />
                            ycRujfMLRrJUcu9jbh5+8v8F7lRWycUjoC9YgrfjCa7xDIyhBWktg0+ldiSqYRzK<br />
                            RrLzEZStBEMuCG5a3d6KLMEvGAIU+GDZ4gD1ZP/CD2875hUkP0iJevKA+OoZ84jk<br />
                            iQDe3MJp4CsnbC6wqMoPIWKXlgAZ4VDb+oav/Z/x5tHUIqij9luu+lHSevt5SbHc<br />
                            sfI2aYcYscUwGnSdLdPnSCQbtO036g5Lx2RnKL6zl/v3qRuWuiXVoNfC3QARAQAB<br />
                            zShDaHJpc3RvcGhlciBCZXNjaCA8bWFpbEBjaHJpcy1iZXNjaC5jb20+wsGHBBMB<br />
                            CAAxFiEEk5Mq0R3MLMtIUq5w1hAY/6OOWvoFAmWnpYUCGwMECwkIBwUVCAkKCwUW<br />
                            AgMBAAAKCRDWEBj/o45a+jsPD/44FswUTYYTamm/lvOv/yhqJRkF9H4HhQbHIQUm<br />
                            lHzSLIbCKtE5HQKqZ6wBikPDq189sO7ZbvKNG9uaHZVXXCe9YVypu96IrnZZurXl<br />
                            7+G24JqKTtKzJ4y7KWgk3v5e1pmajOAy5GhPjHbCJ9Lsvd2BR81WMAaFbPbRCXHP<br />
                            BAGpWF78U5Co4oMFVLkjP+zhk6sAWVHWgsY2siOFQn583Qz7gKTTGNXeLxiHVLOr<br />
                            fDPYWO+U8fiX443EqKm4gnk5yyvz+NT0y+Yp08hDcVlnpY/WFf81xA4yK9sYSOmb<br />
                            6J47+W3DYQrX05Yc+HvT1QLe0vN1P5b3MqRsD9Jv55rZArrG+k1Xya2Ssk4cFKTZ<br />
                            I9DOeKIuWEYPEsoIevj+PMnflO3WHxjTSWtxIu72eUA8gBSzqi3wsFZZLb6WoOtX<br />
                            EYyU2QAocymcQ7W1a3qqWj80fa7LmZPMZt+/lJKqD7x3OHai3j+D+oszuXmNQ+Y5<br />
                            aYeVQ4/PYqn2VfrNHN82+JQFp1vE0RWgYNhM/n9VN70Mpka5J4rrkCM7VotnpIZ9<br />
                            yiVVO0wMtKtgv1kG/SYuOHnWysO7HLSKfyg7rdk4wXdZqs2kOYnhj9NAzZ64SEdo<br />
                            AVUh3g9T1E9J2Db4yvOFBdwCkF4ai6DTBA9g8oClCF4NoJN6XZFgCcSPEpefeEww<br />
                            a7sopM7BTQRlp6WFARAAwVEjWCZkRFG9j6DyVOUSvhZr5YtC65zFXdr016gx87CJ<br />
                            6fsu1wSHEp9rdk7PHQCqZX9M6q1ePRXGfM+Jyx1fe5AUyUzVHo1JVBcAC3YdZane<br />
                            6YTOBg7/n/2n2dQ7tcXxArpzu2D3vw3OBgH4XOojCJeZmd6qtPAqY9f5kqHOdkbm<br />
                            /2UKRwkE2w/+hI62s/999bteYgwjFVMnpLiY/jzkrV3oM7lZKhrSD8PXYwHos3l3<br />
                            0AWK4uS9I/GzthkAbKvAE8vGGcLi2iKh5UYJ1i2iyrnNGi3zA82w/mmsFxZ+aVy2<br />
                            LSahgCz1/3DkTVn0xEgVXvTI9rEBhFc0/Oimw6caHtjBImYIJupQi3p7DjiEUQgK<br />
                            8rNQygHkGidwNwuz49Dv2N3MhqShLHlk5+FuMJkwjSFtDeSTI3dzd5dtO6RZtKk8<br />
                            KYA5bUH+SLYOsajW6fdJrDnaG+fdqRvKdP4o5qy2uGv/bv5G8ZKC9klpgpboiTGR<br />
                            3/BpDnV3K//2MtUG+UYuPlRIDd2BQNqGS0D0lZbi6N65LukciWG1+3xNxTRU8wMA<br />
                            GPymY6pxXCCL+c9UnsVuxospgyFkbNlau0xLoK+dTZCgzCCnJtUlRO761OAppZSu<br />
                            uUF/Vtr+pcL2xokMYBBdgcQ4O3RmEfi8P1bBnppXYTzttwCD+e7Q4EG7tASVCt0A<br />
                            EQEAAcLBdgQYAQgAIBYhBJOTKtEdzCzLSFKucNYQGP+jjlr6BQJlp6WGAhsMAAoJ<br />
                            ENYQGP+jjlr6fVoQAIo8fXPPwCF0HbMLthdCuetNyLZqhK8wXlngxY9KVpJecavK<br />
                            hXXHftreU3K8z3MliTQVxnEGQh8ScS5qhGqMVQ3ZNtLBQufmQ5dnSRzIl/6MZFCn<br />
                            TIubg0E30PonuazNKwE8A629ElOkOKZ4aobp43fSDBEiyBhuF+N7ieqfXzhgOgT9<br />
                            feL89a9Kelx9TfglBdafFed27uEDNZuvGiE3hRSxdYj60df3k3HEtayCvyFFeb23<br />
                            e5v6XSV5VeYVm3yg+naVocynrFUtyupPTkIAg5kosPZgJwr/XZsyMpdZ6IXhfvey<br />
                            Eb8YMLRN1qXVHCreD/RXFSBZu4xp2Ue8YXrQ+BxA4ul4SsdrzZWHFEXYYGrHxrJ8<br />
                            0WA7fpb5Aw4Ygye0yQLlOfdHKddY3dau4Rn8udwlXvFLSSEwYhxrUHUNfiwkyUvx<br />
                            Lak4iUwskpeXb5FTth65G5VjbjrFr92yvfrhJN6kgp+Z2gCnZDhZFTEEsX1WX8hj<br />
                            c24ef3ao9nwJauEfXEknCn3e7uJ2hgoZwWr3W9hQyc64CRC+OO96kYf0oQWMVCPa<br />
                            u3ueAOHvAsAGjP06iXFLi4gCDeF/Sq+0t3Hsr/Ktre7PQpIdH9JKBWF6IClGCsOb<br />
                            lxlxbjJOF8J85cXPiif9GcWRtaCLMCJCvNULptPDrdIlKtU21D58xFKbT4oP<br />
                            =cJgg<br />
                            -----END PGP PUBLIC KEY BLOCK-----
                        </pre>
                    </div>
                </div>

            </div>
            <SubHeading heading="The Music I Own" />
            <div className={styles.music_container}>
                <pre className={styles.music}>
                    Air<br />
                    └── Moon Safari<br />
                    Anna Ternheim<br />
                    ├── All the Way to Rio<br />
                    ├── Naked Versions II<br />
                    └── Separation Road<br />
                    C418<br />
                    ├── 0x10c<br />
                    ├── 148<br />
                    ├── 2 years of failure<br />
                    ├── 72 Minutes Of Fame<br />
                    ├── A Cobblers Tee Thug<br />
                    ├── bps<br />
                    ├── Bushes and Marshmallows<br />
                    ├── circle<br />
                    ├── Cookie Clicker<br />
                    ├── Dief<br />
                    ├── Excursions<br />
                    ├── I forgot something- didn't I<br />
                    ├── life changing moments seem minor in pictures<br />
                    ├── little things<br />
                    ├── Mixes<br />
                    ├── one<br />
                    ├── Seven Years of Server Data<br />
                    ├── sine<br />
                    ├── The Driver - Savlonic (C418 Remix)<br />
                    └── zweitonegoismus<br />
                    Castlecomer<br />
                    └── Castlecomer<br />
                    Detektivbyrån<br />
                    ├── E18<br />
                    └── Wermland<br />
                    Epic Mountain<br />
                    └── Kurzgesagt Vol. 6<br />
                    HOME<br />
                    ├── Odyssey<br />
                    └── Resting State<br />
                    Kraftwerk<br />
                    ├── Die Mensch·Maschine<br />
                    └── Trans Europa Express<br />
                    Lena Raine<br />
                    ├── Celeste<br />
                    ├── Celeste-Farewell<br />
                    └── Singularity<br />
                    Lifeformed<br />
                    ├── Immerse<br />
                    └── Umbra<br />
                    LoFi<br />
                    └── [...]<br />
                    Ludovico Einaudi<br />
                    ├── Elements<br />
                    └── Stanze<br />
                    LÜNE<br />
                    └── Rêve Lucide<br />
                    Moby<br />
                    └── Wait for Me<br />
                    Nolram<br />
                    ├── The Search<br />
                    └── Town Of Broken Ambitions<br />
                    Peter Sandberg<br />
                    └── String Works<br />
                    Philip Ayers<br />
                    └── Juncture<br />
                    Pink Floyd<br />
                    ├── The Dark Side of the Moon<br />
                    └── The Wall<br />
                    Radiohead<br />
                    ├── Amnesiac<br />
                    └── Kid A<br />
                    Seal<br />
                    ├── Seal<br />
                    ├── Seal Hits<br />
                    └── System<br />
                    Solar Fields<br />
                    ├── Earthshine (remastered)<br />
                    ├── Leaving Home<br />
                    └── Versions<br />
                    Soundtrack<br />
                    ├── Astroneer<br />
                    ├── Beyondium<br />
                    ├── BONETONES<br />
                    ├── DEFCON<br />
                    ├── Deus Ex<br />
                    │   ├── Deus Ex Human Revolution<br />
                    │   └── Deus Ex Mankind Divided<br />
                    ├── Factorio<br />
                    ├── Fastfall<br />
                    │   └── extras<br />
                    ├── Half-Life<br />
                    │   ├── Half-Life<br />
                    │   ├── Half-Life 2<br />
                    │   ├── Half-Life 2 Episode One<br />
                    │   ├── Half-Life 2 Episode Two<br />
                    │   ├── Half-Life 3 Unofficial<br />
                    │   ├── Half-Life Alyx<br />
                    │   │   ├── 10. Breaking And Entering<br />
                    │   │   ├── 11. Point Extraction<br />
                    │   │   ├── 1. Entanglement<br />
                    │   │   ├── 2. The Quarantine Zone<br />
                    │   │   ├── 3. Is Or Will Be<br />
                    │   │   ├── 4. Super Weapon<br />
                    │   │   ├── 5. The Northern Star<br />
                    │   │   ├── 6. Arms Race<br />
                    │   │   ├── 7. Jeff<br />
                    │   │   ├── 8. Captivity<br />
                    │   │   └── 9. Revelations<br />
                    │   └── Project Borealis<br />
                    ├── ibb & obb<br />
                    ├── Layers of Fear<br />
                    ├── Minecraft<br />
                    │   ├── Minecraft - Caves & Cliffs<br />
                    │   ├── Minecraft Extract<br />
                    │   ├── Minecraft - Volume Alpha<br />
                    │   └── Minecraft - Volume Beta<br />
                    ├── OBSERVER<br />
                    ├── Outer Wilds<br />
                    ├── Plants vs. Zombies<br />
                    ├── Portal<br />
                    │   ├── Aperture Tag<br />
                    │   ├── Portal<br />
                    │   ├── Portal 2<br />
                    │   └── Portal Stories Mel<br />
                    ├── Prey<br />
                    ├── Shift Happens<br />
                    ├── Smash Hit<br />
                    ├── Stray<br />
                    │   ├── Extradiegetic Music<br />
                    │   └── Intradiegetic Music<br />
                    ├── Subnautica<br />
                    ├── Teardown Part 1<br />
                    ├── The Talos Principle<br />
                    └── We Were Here<br />
                    ├── We Were Here<br />
                    ├── We Were Here Forever<br />
                    ├── We Were Here Together<br />
                    └── We Were Here Too<br />
                    STRFKR<br />
                    ├── Being No One, Going Nowhere<br />
                    ├── Future Past Life<br />
                    └── Reptilians<br />
                    The Album Leaf<br />
                    ├── Between Waves<br />
                    └── Into The Blue Again<br />
                    The City Substrings<br />
                    └── The Day Will Come<br />
                    Wintergatan<br />
                    └── Wintergatan
                </pre>
            </div>
        </Layout >
    );
};
export default About;

export const query = graphql`
query About {
  site {
    siteMetadata {
      linkedin {
        name
        link
      }
      twitter {
        name
        link
      }
      email {
        name
        link
      }
      discord {
        name
        link
      }
      github {
        name
        link
      }
    }
  }
}
`;

export const Head = () => (
    <SEO heading="About & Contact" />
);
