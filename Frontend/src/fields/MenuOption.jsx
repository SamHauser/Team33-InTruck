/**
 * PROPS
 * -----
 * selected
 * label
 * icon
 * onClick
 */
import React, { Component } from "react"

const styles = {
    icon: {
        marginRight: "10%",
    },
    menuOption: {
        marginBottom: "5%",
        padding: "5% 0 5% 5%",
        borderRadius: "5px",
    },
}

export default class MenuOption extends Component {

    render() {
        return (
            <section
                className={`fl itemsCenter hoverable
                            ${this.props.selected ? "selected glow" : ""}`}

                style={styles.menuOption}
                onClick={this.props.onClick}
            >
                {/*Icon*/}
                <article
                    style={styles.icon}
                    className="itemsCenter"
                >
                    {React.cloneElement(this.props.icon, { fontSize: "medium" })}
                </article>

                {/*Label*/}
                {this.props.label}
            </section>
        )
    }
}