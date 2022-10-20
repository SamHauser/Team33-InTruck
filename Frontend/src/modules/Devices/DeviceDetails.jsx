/**
 * PROPS
 * -----
 deviceName
 */

import { AcUnit, Battery1Bar, Battery20, Battery50, Battery80, BatteryCharging20, BatteryCharging30, BatteryCharging50, BatteryCharging80, BatteryChargingFull, BatteryFull, BatteryUnknown, HourglassTop, SignalCellular0Bar, SignalCellular1Bar, SignalCellular2Bar, SignalCellular3Bar, SignalCellular4Bar, SignalCellularConnectedNoInternet0Bar, SignalCellularNodata, Speed, Thermostat, Water } from "@mui/icons-material"
import { Component } from "react"
import { COLOURS } from "../../config"
import { apiGetCall } from "../../generics/APIFunctions"
import { isEmpty, valueOrEmpty } from "../../generics/GeneralFunctions"
import InfoBlock from "../InfoBlock"
import InfoLine from "../InfoLine"
import Map from "../Map"
import moment from "moment"
import DeviceConfig from "./DeviceConfig"

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
            loading: false,
        }
    }

    getArrValue = (category) => {
        const { truck } = this.state

        //If category doesnt exist
        if (isEmpty(truck[category]) || isEmpty(truck)) {
            return []
        }

        return truck[category]
    }

    getSubValue = (category, prop) => {
        const { truck } = this.state

        //If category doesnt exist
        if (isEmpty(truck[category]) || isEmpty(truck)) {

            return valueOrEmpty("")
        }

        //Get the latest row
        const row = truck[category][truck[category].length - 1]

        //Dirty code to catch not installed batteries
        if (category === "battery") {
            if (!row.installed) {
                return "Not installed"
            }
        }

        return valueOrEmpty(row[prop])
    }

    GETdeviceDetails = () => {
        const secondsBefore = 10
        const from = (new Date().getTime() / 1000) - secondsBefore * 1000
        const to = new Date().getTime() / 1000
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
                        if (typeof truck[key][truck[key].length - 1] !== "object") { continue }
                        moment.locale("en-au")
                        truck[key][truck[key].length - 1].timestamp = moment(row.timestamp).format("HH:mm:ss")
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

    componentDidMount() {
        this.reloader = setInterval(() => {
            this.GETdeviceDetails()
        }, 10000);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.deviceName !== this.props.deviceName) {
            this.GETdeviceDetails()
        }
    }

    componentWillUnmount() {
        clearInterval(this.reloader)
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

        const getNetworkIcon = () => {
            let network = truck ? truck.network : null
            if (isEmpty(network)) {
                return <SignalCellularNodata />
            }
            network = network[network.length - 1]
            const rssi = Number(network.rssi)
            if (rssi === 0) {
                return <SignalCellular0Bar />
            } else if (rssi < 8) {
                return <SignalCellular1Bar />
            } else if (rssi < 16) {
                return <SignalCellular2Bar />
            } else if (rssi < 24) {
                return <SignalCellular3Bar />
            } else if (rssi <= 31) {
                return <SignalCellular4Bar />
            } else {
                return <SignalCellularConnectedNoInternet0Bar />
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

                                {/*Network*/}
                                <InfoBlock
                                    label="Network"
                                    loading={this.state.loading}
                                    icon={getNetworkIcon()}
                                    colour={COLOURS[5]}
                                    value={`${this.getSubValue("network", "operator")} ${this.getSubValue("network", "access_tech")}`}
                                />

                                {/* Temperature line */}
                                <InfoLine
                                    label="Temperature"
                                    size={1}
                                    icon={<Thermostat />}
                                    colour={COLOURS[2]}
                                    data={this.getArrValue("environment")}
                                    x="timestamp"
                                    y="temperature"
                                />

                                {/* Humidity Line */}
                                <InfoLine
                                    label="Humidity"
                                    size={1}
                                    icon={<AcUnit />}
                                    colour={COLOURS[3]}
                                    data={this.getArrValue("environment")}
                                    x="timestamp"
                                    y="humidity"
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

                        {/*Config*/}
                        <DeviceConfig deviceName={this.props.deviceName} />
                    </article>
                }



            </article>
        )
    }
}