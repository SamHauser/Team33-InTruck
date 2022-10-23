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
import { apiGetCall, apiPostCall } from "../../generics/APIFunctions"
import { isEmpty, valueOrEmpty } from "../../generics/GeneralFunctions"
import { Lunchbox } from "../../generics/Lunchbox"
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

export default class DeviceConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            truck: {},
            config: {},
            openSnacks: [],
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

    addSnack = (snackId, msg) => {
        let { openSnacks } = this.state
        openSnacks.push(snackId)
        this.setState({
            errMsg: msg,
            openSnacks: openSnacks
        })
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
            this.addSnack(1)
        }
        const error = e => {
            this.addSnack(0, e)
            console.error(e)
        }
        apiPostCall(url, "POST", body, callback, error)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.deviceName !== this.props.deviceName) {
            this.GETdeviceConfig()
        }
    }

    render() {
        let { truck, config } = this.state
        if (!config.device_name) { return <div /> }
        const snacks = [
            {
                label: `Error ${this.state.errMsg}`,
                severity: "error"
            },
            {
                label: "config saved",
                severity: "success"
            }
        ]


        return (
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

                <Lunchbox
                    snacks={snacks}
                    openSnacks={this.state.openSnacks}
                    onClose={(id) => {
                        var openSnacks = this.state.openSnacks;
                        openSnacks.splice(id, 1);
                        this.setState({ openSnacks: openSnacks });
                    }}
                />
            </article>

        )
    }
}