/**
 * PROPS
 * -----
 deviceName
 */

import { Battery1Bar, Battery20, Battery50, Battery80, BatteryCharging20, BatteryCharging30, BatteryCharging50, BatteryCharging80, BatteryChargingFull, BatteryFull, BatteryUnknown, HourglassTop, Speed, Thermostat, Water } from "@mui/icons-material"
import { Button, CircularProgress } from "@mui/material"
import { Component } from "react"
import { COLOURS } from "../../config"
import BasicField from "../../fields/BasicField"
import Input from "../../fields/Input"
import Title from "../../fields/Title"
import { apiGetCall, apiPostCall } from "../../generics/APIFunctions"
import { isEmpty, valueOrEmpty } from "../../generics/GeneralFunctions"
import InfoBlock from "../InfoBlock"
import Map from "../Map"

const styles = {
    container: {
        padding: "0 10px",
    },
    configContainer: {
        border: "1px solid grey",
        borderRadius: 5,
        padding: "1%",
        marginBottom: 20,
    },
    configTitle: {
        marginTop: 0,
        marginBottom: 35
    },
    title: {
        whiteSpace: "nowrap"
    },
    input: {
        marginBottom: "2%",
        marginRight: 10
    }
}

export default class DeviceDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            truck: {},
            config: {},
            loading: false,
        }
    }
    handleChange = ev => {
        let { config } = this.state
        config[ev.target.name] = ev.target.value

        this.setState({
            config: config
        })

    }

    handleSaveConfig = () => {
        this.POSTconfig()
    }

    getSubValue = (category, prop) => {
        const { truck } = this.state

        //If category doesnt exist
        if (isEmpty(truck[category]) || isEmpty(truck)) {
            return valueOrEmpty("")
        }

        const row = truck[category][truck[category].length - 1]
        return valueOrEmpty(row[prop])
    }

    GETdeviceDetails = () => {
        const secondsBefore = 10
        // const from = new Date().getTime() - secondsBefore * 1000
        // const to = new Date().getTime()
        const from = 1663336800000
        const to = 1663423200000
        const url = `device/getDeviceDataRange/${this.props.deviceName}, ${from}, ${to}`
        const keys = ["network", "battery", "environment", "timestamp", "device_name", "alert"]
        const callback = data => {
            let truck = {}
            //Convert each row of data into an array of entries
            for (let key of keys) {
                truck[key] = []
                for (let row of data) {
                    if (row[key]) {
                        truck[key].push(row[key])
                    }
                }
            }

            truck.device_name = truck.device_name[data.length - 1]
            this.setState({
                truck: truck,
                loading: false,
            })

        }
        const error = e => {
            this.setState({
                loading: false
            })

        }

        this.setState({
            loading: true,
        })
        apiGetCall(url, callback, error, true)

    }

    GETdeviceConfig = () => {
        const url = `config/getConfig/${this.props.deviceName}`
        const callback = d => {
            this.setState({
                config: d[0]
            })
        }
        const error = e => {
            console.error(e)
            this.setState({
                config: {}
            })
        }
        apiGetCall(url, callback, error)
    }

    POSTconfig = () => {
        const url = "config"
        const body = JSON.stringify(this.state.config)
        const callback = d => {

        }
        const error = e => {
            console.error(e)
        }
        apiPostCall(url, "POST", body, callback, error)
    }

    componentDidMount() {
        setInterval(() => {
            this.GETdeviceDetails()
        }, 10000);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.deviceName !== this.props.deviceName) {
            this.GETdeviceDetails()
            this.GETdeviceConfig()
        }
    }

    render() {
        let { truck, config } = this.state
        if (!truck || !truck.device_name) { truck = null }
        const getBatteryIcon = () => {
            let battery = truck ? truck.battery : null
            if (isEmpty(battery)) {
                return <BatteryUnknown />
            }
            battery = battery[battery.length - 1]

            //Unknown
            if (isEmpty(battery.charge_level)) {
                return <BatteryUnknown />
            }

            //Charging
            if (battery.charging) {
                // < 20%
                if (battery.charge_level < 20) {
                    return <BatteryCharging20 />
                }
                // < 50%
                if (battery.charge_level < 50) {
                    return <BatteryCharging30 />
                }
                // < 80%
                if (battery.charge_level < 80) {
                    return <BatteryCharging50 />
                }
                // < 100%
                if (battery.charge_level < 100) {
                    return <BatteryCharging80 />
                }

                //Fully charge
                return <BatteryChargingFull />
            } else {//On battery
                // < 20%
                if (battery.charge_level < 20) {
                    return <Battery1Bar />
                }
                // < 50%
                if (battery.charge_level < 50) {
                    return <Battery20 />
                }
                // < 80%
                if (battery.charge_level < 80) {
                    return <Battery50 />
                }
                // < 100%
                if (battery.charge_level < 100) {
                    return <Battery80 />
                }

                //Fully charge
                return <BatteryFull />

            }
        }



        return (
            <article className="pad" style={styles.container}>
                <h2 style={styles.title}>Truck Details</h2>


                {/*Details*/}
                {this.props.deviceName === "" ?
                    <h5>No Truck selected</h5> :

                    <article>

                        {/*Device Info*/}
                        <article>
                            <section className="wrap around">

                                {/*Current Temp */}
                                <InfoBlock
                                    label="Temperature"
                                    loading={this.state.loading}
                                    icon={<Thermostat />}
                                    value={this.getSubValue("environment", "temperature")}
                                />

                                {/*Humidity*/}
                                <InfoBlock
                                    label="Humidity"
                                    loading={this.state.loading}
                                    icon={<Water />}
                                    value={this.getSubValue("environment", "humidity")}
                                    colour={COLOURS[4]}
                                />

                                {/*Speed*/}
                                <InfoBlock
                                    label="Battery"
                                    loading={this.state.loading}
                                    icon={getBatteryIcon()}
                                    value={this.getSubValue("battery", "charge_level")}
                                    colour={COLOURS[2]}
                                />

                                {/*Status*/}
                                <InfoBlock
                                    label="Battery Temperature"
                                    loading={this.state.loading}
                                    icon={<Thermostat />}
                                    colour={COLOURS[2]}
                                    value={this.getSubValue("battery", "temp")}
                                />

                            </section>
                            {this.getSubValue("location", "fix") !== "No data" ?
                                <Map
                                    markers={[
                                        {
                                            lat: -37.8243913,
                                            long: 145.0396567
                                        },
                                    ]}
                                />
                                :
                                <h5 className="selfCenter">Unable to determine location</h5>

                            }
                        </article>

                        {/* Configuration */}
                        {config.device_name &&
                            <article style={styles.configContainer}>

                                <h3 style={styles.configTitle}>Configuration</h3>

                                <section className="wrap">
                                    {/*ID*/}
                                    <BasicField
                                        disabled
                                        label="Name"
                                        value={config.device_name}
                                        onChange={this.handleChange}
                                        style={styles.input}
                                        name="device_name"
                                    />

                                    {/*Registration*/}
                                    <BasicField
                                        label="Registration"
                                        value={config.vehicle_rego}
                                        style={styles.input}
                                        onChange={this.handleChange}
                                        name="vehicle_rego"

                                    />
                                    {/*Max Humidity*/}
                                    <BasicField
                                        label="Maximum Humidity"
                                        value={config.max_hum}
                                        style={styles.input}
                                        onChange={this.handleChange}
                                        name="max_hum"
                                    />
                                    {/*Min Humidity*/}
                                    <BasicField
                                        label="Minimum Humidity"
                                        value={config.min_hum}
                                        style={styles.input}
                                        onChange={this.handleChange}
                                        name="min_hum"
                                    />
                                    {/*Max Temperature*/}
                                    <BasicField
                                        label="Maximum Temperature"
                                        value={config.max_temp}
                                        style={styles.input}
                                        onChange={this.handleChange}
                                        name="max_temp"
                                    />
                                    {/*Min Temperature*/}
                                    <BasicField
                                        label="Minimum Temperature"
                                        value={config.min_temp}
                                        style={styles.input}
                                        onChange={this.handleChange}
                                        name="min_temp"
                                    />
                                </section>

                                <section className="end">
                                    <Button
                                        variant="outlined"
                                        onClick={this.handleSaveConfig}
                                    >
                                        Save Config
                                    </Button>
                                </section>

                            </article>
                        }
                    </article>
                }



            </article>
        )
    }
}