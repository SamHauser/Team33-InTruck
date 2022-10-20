/**
 * PROPS
 * -----
 * label
 * size - in info block units
 * icon
 * dataKey
 * data
 */
import React, { Component } from "react"
import { ResponsiveContainer, YAxis, XAxis, AreaChart, Area, Tooltip } from 'recharts'
import { COLOURS } from "../config"

const styles = {
    container: {
        width: 450,
        height: 200
    },
    labelContainer: {
        padding: 10,
        borderRadius: "12px 0 0 12px",
        width: 150,
        marginRight: 5,
    },
    icon: {
        color: COLOURS[5]
    },
    label: {
        marginBottom: 0,
        color: COLOURS[5]
    },
    value: {
        color: "white"
    }
}

export default class InfoLine extends Component {

    render() {
        const domain = () => {
            let min = Infinity
            let max = -Infinity
            for (let i of this.props.data) {
                const val = Number(i[this.props.y])
                if (val < min) {
                    min = val
                }
                if (val > max) {
                    max = val
                }
            }

            const domain = [Number(min), Number(max)]
            return domain

        }

        return (
            <section
                className="full module"
                style={styles.container}
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
                <div className="full">

                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <AreaChart
                            data={this.props.data}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <YAxis dataKey={this.props.y} domain={domain()} />
                            <XAxis dataKey={this.props.x} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey={this.props.y}
                                stroke={this.props.colour}
                                fillOpacity={1}
                                fill={`url(#colour${this.props.x})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section >
        )
    }
}