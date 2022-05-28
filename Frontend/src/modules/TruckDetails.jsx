/**
 * PROPS
 * -----
 * truck - detail data
 */

import { AcUnit, HourglassTop, Speed, Thermostat, Water } from "@mui/icons-material"
import { TextField } from "@mui/material"
import { Component } from "react"
import { COLOURS } from "../config"
import Input from "../fields/Input"
import Title from "../fields/Title"
import InfoBlock from "./InfoBlock"
import Map from "./Map"

const styles = {
    input: {
        marginBottom: "2%"
    }
}

export default class TruckDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        let truck = this.props.truck
        if (!truck || truck == {}) {
            truck = null
        }

        return (
            <article className="pad">
                <Title label="Truck Details" />

                {/*Details*/}
                {truck === null ?
                    <h5>No Truck selected</h5> :
                    <article>
                        <section className="wrap fullWidth between">
                            {/*ID*/}
                            <Input
                                label="ID"
                                value={truck.id}
                                style={styles.input}
                            />

                            {/*Registration*/}
                            <Input
                                label="Registration"
                                value={truck.rego}
                                style={styles.input}
                            />
                            {/*Driver*/}
                            <Input
                                label="Driver"
                                value={truck.driver}
                                style={styles.input}
                            />
                            {/*Address*/}
                            <Input
                                label="Address"
                                value={truck.address}
                                style={styles.input}
                            />
                        </section>
                        <section className="wrap around">

                            {/*Current Temp */}
                            <InfoBlock
                                label="Temperature"
                                icon={<Thermostat />}
                                value={"-5°C"}
                            />

                            {/*Humidity*/}
                            <InfoBlock
                                label="Humidity"
                                icon={<Water />}
                                value={"63%"}
                                colour={COLOURS[4]}
                            />

                            {/*Speed*/}
                            <InfoBlock
                                label="Speed"
                                icon={<Speed />}
                                value={"56 km/h"}
                                colour={COLOURS[2]}
                            />

                            {/*Status*/}
                            <InfoBlock
                                label="Status"
                                icon={<HourglassTop />}
                                value={"En Route"}
                            />

                            <Map
                                markers={[
                                    {
                                        lat: -37.8243913,
                                        long: 145.0396567
                                    },
                                ]}
                            />
                        </section>
                    </article>
                }



            </article>
        )
    }
}