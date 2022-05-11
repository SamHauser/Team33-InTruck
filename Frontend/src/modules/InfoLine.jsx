/**
 * PROPS
 * -----
 * label
 * icon
 * data
 */
import React, { Component } from "react"
import { COLOURS } from "../config"
import { ResponsiveContainer, YAxis, AreaChart, Area } from 'recharts'

const styles = {
    container: {
        padding: 0
    },
    labelContainer: {
        padding: 10,
        borderRadius: "12px 0 0 12px",
        maxWidth: 65,
        width: 65,
        marginRight: 5
    },
    icon: {
        color: COLOURS[1]
    },
    label: {
        marginBottom: 0,
        color: COLOURS[1]
    },
    value: {
        color: "white"
    }
}

export default class InfoLine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            height: 164,
            width: 552,
        }
    }


    componentDidMount() {
        //Get average height and width of other info items
        const iconBlock = document.getElementById("iconBlock")
        if (iconBlock) {
            const margin = window.getComputedStyle(iconBlock).marginRight.substring(0, 2)

            this.setState({
                height: iconBlock.clientHeight,
                width: (iconBlock.clientWidth * 3) + (margin * 2) - 90
            })
        }
    }

    render() {

        return (
            <section
                style={{
                    ...styles.container,
                    ...{
                        height: this.state.height
                    }
                }}
            >
                <article
                    className="center itemsCenter"
                    style={{
                        ...styles.labelContainer,
                        ...{ backgroundColor: this.props.colour }
                    }}
                >

                    {/*Icon*/}
                    <div
                        className="selfCenter"
                        style={styles.icon}
                    >
                        {React.cloneElement(this.props.icon, { fontSize: "large" })}
                    </div>
                    {/*Label */}
                    <h3 style={styles.label}>{this.props.label}</h3>
                </article>

                {/*Data*/}
                <div className="fullHeight" style={{
                    width: this.state.width,
                }}>

                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <AreaChart
                            data={this.props.data}
                        >
                            <defs>
                                <linearGradient id={`colour${this.props.label}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={this.props.colour} stopOpacity="0.8" />
                                    <stop offset="95%" stopColor={COLOURS[1]} stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            <YAxis dataKey="earnings" />
                            <Area
                                type="monotone"
                                dataKey="earnings"
                                stroke={this.props.colour}
                                fillOpacity={1}
                                fill={`url(#colour${this.props.label})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section >
        )
    }
}