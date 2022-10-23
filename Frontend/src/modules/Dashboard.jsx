/**
 * PROPS
 * -----
 */
import { BatteryCharging20, LocalShipping, } from "@mui/icons-material"
import { Component } from "react"
import { COLOURS } from "../config"
import Title from "../fields/Title"
import Alerts from "./Alerts"
import InfoBlock from "./InfoBlock"
import Module from "./Module"
import Map from "./Map"
import { apiGetCall } from "../generics/APIFunctions"

export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            latestData: { rows: [] },
        }
    }

    GETlatestData = () => {
        const url = "device/getLatestEntry"
        const callback = d => {
            d = { rows: d }
            // console.log(d)

            //Set marker locations
            let markers = []
            for (let row of d.rows) {
                if (!row.location || !row.location.lat) { continue }
                markers.push({
                    name: row.device_name,
                    lat: row.location.lat,
                    lon: row.location.lon
                })
            }
            d.markers = markers

            //Set amount of devices on charge
            let onCharge = 0
            for (let row of d.rows) {
                if (!row.battery) { continue }
                if (row.battery.charging === "true") {
                    onCharge++
                }
            }
            d.onCharge = onCharge

            this.setState({
                latestData: d,
            })
        }
        const error = e => {

        }
        apiGetCall(url, callback, error, true)

    }
    componentDidMount() {
        //First time
        this.GETlatestData()

        //Refresh rate in seconds
        const refreshRate = 2
        this.reloader = setInterval(() => {
            this.GETlatestData()
        }, refreshRate * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.reloader)
    }

    render() {
        return (<article className="full">
            <Title label="Dashboard" />

            {/*Stats*/}
            <section className="wrap">
                <Module width={2}>
                    <Alerts latestData={this.state.latestData.rows} />
                </Module>

                {/*Trucks*/}
                <InfoBlock
                    colour={COLOURS[2]}
                    isUnit
                    label="Trucks"
                    icon={<LocalShipping />}
                    value={this.state.latestData.rows.length}
                />
                {/*Trucks*/}
                <InfoBlock
                    colour={COLOURS[3]}
                    label="On Charge"
                    icon={<BatteryCharging20 />}
                    value={this.state.latestData.onCharge}
                />
            </section>

            {/*Map*/}
            <section className="wrap">
                <Module width={5} height={2}>
                    <Map
                        markers={this.state.latestData.markers}

                    />
                </Module>
            </section>

        </article >)
    }
}