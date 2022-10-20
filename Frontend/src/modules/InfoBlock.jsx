/**
 * PROPS
 * -----
 * label
 * icon
 * value
 * colour
 * bauble
 * isUnit - is this module the basis for all unit calculations
 */
import { CircularProgress } from "@mui/material"
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

    componentDidMount() {
        if (this.props.isUnit) {
            var el = document.getElementById("iconBlock")
            const margin = window.getComputedStyle(el).marginRight.substring(0, 2)
            sessionStorage.setItem("unitMargin", margin)

            let unitWidths = []
            let unitHeights = []
            for (let i = 0; i < 10; i++) {
                if (i === 0) {
                    unitWidths.push(0)
                    unitHeights.push(0)
                    continue
                }
                unitWidths.push((el.clientWidth * i) + (margin * (i - 1)))
                unitHeights.push((el.clientHeight * i) + (margin * (i - 1)))
            }
            sessionStorage.setItem("unitHeights", JSON.stringify(unitHeights))
            sessionStorage.setItem("unitWidths", JSON.stringify(unitWidths))
            window.dispatchEvent(new Event('unit'))
        }
    }

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
                {this.props.loading ? <CircularProgress /> :
                    <h2 style={styles.value}>{this.props.value}</h2>
                }
            </article >
        )
    }
}