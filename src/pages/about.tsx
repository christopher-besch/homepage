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

    const music_lib = `.
├── Air
│   └── Moon Safari
├── Anna Ternheim
│   ├── All the Way to Rio
│   ├── Naked Versions II
│   └── Separation Road
├── C418
│   ├── 0x10c
│   ├── 148
│   ├── 2 years of failure
│   ├── 72 Minutes Of Fame
│   ├── A Cobblers Tee Thug
│   ├── bps
│   ├── Bushes and Marshmallows
│   ├── circle
│   ├── Cookie Clicker
│   ├── Dief
│   ├── Excursions
│   ├── I forgot something- didn't I
│   ├── life changing moments seem minor in pictures
│   ├── little things
│   ├── Mixes
│   ├── one
│   ├── Seven Years of Server Data
│   ├── sine
│   ├── The Driver - Savlonic (C418 Remix)
│   └── zweitonegoismus
├── Castlecomer
│   └── Castlecomer
├── Detektivbyrån
│   ├── E18
│   └── Wermland
├── Epic Mountain
│   └── Kurzgesagt Vol. 6
├── HOME
│   ├── Odyssey
│   └── Resting State
├── Jamie xx
│   └── In Waves
├── Kettel
│   ├── [AF008] Alacasa EP
│   ├── Myam James 2 (10th Anniversary Edition)
│   └── Wingtip
├── Kraftwerk
│   ├── Die Mensch·Maschine
│   └── Trans Europa Express
├── Lena Raine
│   ├── Celeste
│   ├── Celeste-Farewell
│   └── Singularity
├── Lifeformed
│   ├── Immerse
│   └── Umbra
├── LoFi
│   └── [...]
├── loscil
│   └── Plume
├── Ludovico Einaudi
│   ├── Elements
│   └── Stanze
├── LÜNE
│   └── Rêve Lucide
├── Moby
│   └── Wait for Me
├── Nolram
│   ├── The Search
│   └── Town Of Broken Ambitions
├── Peter Sandberg
│   └── String Works
├── Philip Ayers
│   └── Juncture
├── Pink Floyd
│   ├── A Momentary Lapse of Reason
│   ├── The Dark Side of the Moon
│   ├── The Division Bell
│   └── The Wall
├── Radiohead
│   ├── Amnesiac
│   └── Kid A
├── R.E.M.
│   └── Automatic for the People
├── Seal
│   ├── Seal
│   ├── Seal Hits
│   └── System
├── Solar Fields
│   ├── Earthshine
│   ├── Leaving Home
│   └── Versions
├── Soundtrack
│   ├── Astroneer
│   ├── Beyondium
│   ├── BONETONES
│   ├── Catacomb Snatch
│   ├── DEFCON
│   ├── Deus Ex
│   │   ├── Deus Ex Human Revolution
│   │   └── Deus Ex Mankind Divided
│   ├── Factorio
│   ├── Fastfall
│   │   └── extras
│   ├── FEZ
│   ├── Half-Life
│   │   ├── Black Mesa Terra
│   │   ├── Black Mesa Xen
│   │   ├── Half-Life
│   │   ├── Half-Life 2
│   │   ├── Half-Life 2 Episode One
│   │   ├── Half-Life 2 Episode Two
│   │   ├── Half-Life 3 Unofficial
│   │   ├── Half-Life: Alyx
│   │   │   ├── 10. Breaking And Entering
│   │   │   ├── 11. Point Extraction
│   │   │   ├── 1. Entanglement
│   │   │   ├── 2. The Quarantine Zone
│   │   │   ├── 3. Is Or Will Be
│   │   │   ├── 4. Super Weapon
│   │   │   ├── 5. The Northern Star
│   │   │   ├── 6. Arms Race
│   │   │   ├── 7. Jeff
│   │   │   ├── 8. Captivity
│   │   │   └── 9. Revelations
│   │   └── Project Borealis
│   ├── ibb & obb
│   ├── Layers of Fear
│   ├── Minecraft
│   │   ├── Minecraft - Caves & Cliffs
│   │   ├── Minecraft Extract
│   │   ├── Minecraft - Volume Alpha
│   │   └── Minecraft - Volume Beta
│   ├── OBSERVER
│   ├── Outer Wilds
│   ├── Plants vs. Zombies
│   ├── Portal
│   │   ├── Aperture Tag
│   │   ├── Portal
│   │   ├── Portal 2
│   │   └── Portal Stories Mel
│   ├── Prey
│   ├── Shift Happens
│   ├── Smash Hit
│   ├── Stray
│   │   ├── Extradiegetic Music
│   │   └── Intradiegetic Music
│   ├── Subnautica
│   ├── Teardown Part 1
│   ├── The Talos Principle
│   ├── The Vanishing of Ethan Carter
│   ├── TUNIC
│   ├── Undertale
│   └── We Were Here
│       ├── We Were Here
│       ├── We Were Here Forever
│       ├── We Were Here Together
│       └── We Were Here Too
├── STRFKR
│   ├── Being No One, Going Nowhere
│   ├── Future Past Life
│   └── Reptilians
├── The Album Leaf
│   ├── Between Waves
│   └── Into The Blue Again
├── The City Substrings
│   └── The Day Will Come
├── Wintergatan
│   └── Wintergatan
└── Wolfgang Amadeus Mozart
    ├── Complete Mozart Edition, Volume 16: Music for 2 Pianos Piano Duets
    ├── Die Hornkonzerte
    ├── The Great Piano Concertos 1: Nos. 19, 20, 21, 23, 24 2 Concert Rondos
    ├── Violin Concertos Nº 1, 2 & 3
    └── Violin Concertos No. 4 & No. 5 Adagio in E major Rondo in C major`;

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
                    {music_lib}
                </pre>
            </div>
        </Layout>
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
