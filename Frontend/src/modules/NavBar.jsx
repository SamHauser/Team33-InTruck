/**
 * PROPS
 * -----
 * selOption - the currently selected menu option
 * options - the available menu options
 * onClick() - returns the selected menu option
 */

import React, { Component } from "react"
import MenuOption from "../fields/MenuOption"

const styles = {
    container: {
        width: "15%",
        minWidth: 150,
        position: "fixed"
    },
    inner: {
        padding: "5% 0 0 5%"
    },
    logo: {
        height: "15%",
        padding: "0 10%"
    },
    options: {
        height: "75%"
    },
    settings: {
        height: "10%"
    }
}


export default class NavBar extends Component {

    render() {
        //Is the currently selected option this option
        const isMe = (name) => {
            return this.props.selOption === name
        }

        return (
            <article
                className="fullHeight"
                style={styles.container}
            >
                <article
                    className="fg fullHeight"
                    style={styles.inner}
                >

                    {/*Logo*/}
                    <article
                        style={styles.logo}
                        className="hoverable"
                        onClick={() => this.props.onClick(options[0])}
                    >
                        <h1 className="fxl">
                            In<span style={{ color: "white" }}>Truck</span>
                        </h1>
                    </article>

                    {/*Menu Options*/}
                    <article style={styles.options}>
                        {this.props.options[0].map((opt, i) => (
                            <MenuOption
                                key={i}
                                selected={isMe(opt.name)}
                                label={opt.name}
                                icon={opt.icon}
                                onClick={() => this.props.onClick(opt)}
                            />
                        ))}
                    </article>


                    {/*Settings/Logout*/}
                    <article className="end" style={styles.settings}>
                        {this.props.options[1].map((opt, i) => (
                            <MenuOption
                                key={i}
                                label={opt.name}
                                icon={opt.icon}
                                onClick={() => this.props.onClick(opt)}
                            />
                        ))}
                    </article>

                </article>

            </article>
        )
    }
}