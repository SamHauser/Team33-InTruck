/**
 * PROPS
 * -----
 deviceName
 */

import { HourglassTop, Speed, Thermostat, Water } from "@mui/icons-material"
import { Component } from "react"
import { COLOURS } from "../../config"
import Input from "../../fields/Input"
import Title from "../../fields/Title"
import { apiGetCall } from "../../generics/APIFunctions"
import InfoBlock from "../InfoBlock"
import Map from "../Map"

const styles = {
    container: {
        padding: "0 10px",

    },
    title: {
        whiteSpace: "nowrap"
    },
    input: {
        marginBottom: "2%"
    }
}

export default class DeviceDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    GETdeviceDetails = () => {
        const url = `device/getDeviceData/${this.props.deviceName}`
        const callback = data => {
            console.log(data)

        }
        const error = e => {

        }
        apiGetCall(url, callback, error, true)

    }

    GETdeviceConfig = () => {
        const url = `config/getConfig/${this.props.deviceName}`
        const callback = d => {

        }
        const error = e => {
            console.error(e)
        }
        apiGetCall(url, callback, error)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.deviceName !== this.props.deviceName) {
            //this.GETdeviceDetails()
            this.GETdeviceConfig()
        }
    }

    render() {
        let truck = this.props.truck
        if (!truck || truck == {}) {
            truck = null
        }

        return (
            <article className="pad" style={styles.container}>
                <h2 style={styles.title}>Truck Details</h2>

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