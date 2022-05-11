/**
 * PROPS
 * -----
 * label
 * icon
 * value
 */
import React, { Component } from "react"
import { COLOURS } from "../config"

const styles = {
    container: {
        width: 150,
        maxWidth: 150,
        padding: 7
    },
    icon: {
        color: COLOURS[2]
    },
    label: {
        marginBottom: 0
    },
    value: {
        color: "white"
    }
}

export default class InfoBlock extends Component {

    render() {
        return (
            <article
                id="iconBlock"
                className="fg module"
                style={styles.container}
            >
                {/*Icon*/}
                <div
                    style={{
                        ...styles.icon, ...{
                            color: this.props.colour
                        }
                    }}
                >
                    {React.cloneElement(this.props.icon, { fontSize: "large" })}
                </div>

                {/*Label */}
                <h3 style={styles.label}>{this.props.label}</h3>

                {/*Value*/}
                <h2 style={styles.value}>{this.props.value}</h2>
            </article >
        )
    }
}