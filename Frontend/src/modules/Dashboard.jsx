/**
 * PROPS
 * -----
 */
import { AttachMoney, BatteryCharging20, CreditCard, LocalShipping, Sell, ThirtyFpsOutlined } from "@mui/icons-material"
import { Component } from "react"
import { COLOURS } from "../config"
import Title from "../fields/Title"
import Alerts from "./Alerts"
import InfoBlock from "./InfoBlock"
import InfoLine from "./InfoLine"
import Module from "./Module"
import Map from "./Map"
import { apiGetCall } from "../generics/APIFunctions"

const blockData = [
    {
        label: "Trucks",
        icon: <LocalShipping />,
        value: 20
    },
    {
        label: "Orders",
        icon: <CreditCard />,
        value: 167
    },
    {
        label: "Revenue",
        icon: <AttachMoney />,
        value: "$16,572.84"
    }
]

const lineData = [
    {
        label: "Trucks",
        icon: <LocalShipping />,
    },
    {
        label: "Orders",
        icon: <CreditCard />,
    },
    {
        label: "Revenue",
        icon: <AttachMoney />,
    }
]



const saleData = [{ "date": "4/20/2022", "earnings": 6991 },
{ "date": "12/8/2021", "earnings": 628 },
{ "date": "7/30/2021", "earnings": 8690 },
{ "date": "12/27/2021", "earnings": 4588 },
{ "date": "11/6/2021", "earnings": 9525 },
{ "date": "5/9/2022", "earnings": 9549 },
{ "date": "1/21/2022", "earnings": 2470 },
{ "date": "7/23/2021", "earnings": 4253 },
{ "date": "2/5/2022", "earnings": 1717 },
{ "date": "7/12/2021", "earnings": 2448 },
{ "date": "4/4/2022", "earnings": 5901 },
{ "date": "3/28/2022", "earnings": 2031 },
{ "date": "2/11/2022", "earnings": 3008 },
{ "date": "10/5/2021", "earnings": 8921 },
{ "date": "1/25/2022", "earnings": 6142 },
{ "date": "3/20/2021", "earnings": 3868 },
{ "date": "10/14/2021", "earnings": 7470 },
{ "date": "9/30/2021", "earnings": 6835 },
{ "date": "4/6/2021", "earnings": 3076 },
{ "date": "1/26/2022", "earnings": 4581 },
{ "date": "11/9/2021", "earnings": 3184 },
{ "date": "11/22/2021", "earnings": 3141 }]
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
                    long: row.location.lon
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
            // this.GETlatestData()
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
                <Module width={6} height={3}>
                    <Map
                        markers={this.state.latestData.markers}

                    />
                </Module>
            </section>

        </article >)
    }
}