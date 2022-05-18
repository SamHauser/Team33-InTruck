/**
 * PROPS
 * -----
 */
import { AttachMoney, CreditCard, LocalShipping, Sell } from "@mui/icons-material"
import { Component } from "react"
import { COLOURS } from "../config"
import Title from "../fields/Title"
import InfoBlock from "./InfoBlock"
import InfoLine from "./InfoLine"
import Module from "./Module"
import TestMap from "./TestMap"

const styles = {
    module: {
    }
}

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

        }
    }

    render() {
        return (<article className="full">
            <Title label="Dashboard" />
            <section className="wrap">
                {blockData.map((d, i) => (
                    <InfoBlock
                        key={i}
                        colour={COLOURS[i + 2]}
                        {...d}
                    />
                ))}

                {lineData.map((d, i) => (
                    <Module key={i}>
                        <InfoLine
                            key={i}
                            colour={COLOURS[i + 2]}
                            {...d}
                            data={saleData}
                        />
                    </Module>
                ))}

                <Module>
                    <TestMap />
                </Module>

            </section>
        </article>)
    }
}