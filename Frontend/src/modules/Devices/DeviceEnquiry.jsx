/**
 * PROPS
 * -----
 */
import { Component } from "react"
import Module from "../Module"
import DeviceDetails from "./DeviceDetails";
import DeviceSelection from "./DeviceSelection";


const styles = {
}

export default class DeviceEnquiry extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDevice: "",
        }
    }

    handleDeviceSelect = device => {
        this.setState({
            selectedDevice: device
        })
    }

    componentDidMount() {
        const lastDevice = sessionStorage.getItem("lastDevice")
        if (lastDevice) {
            this.setState({
                selectedDevice: lastDevice
            })
            sessionStorage.removeItem("lastDevice")
        }
    }


    render() {

        return (
            <section>
                {/*Selection*/}
                <Module>
                    <DeviceSelection
                        onClick={this.handleDeviceSelect}
                        selectedDevice={this.state.selectedDevice}
                    />
                </Module>


                {/*Details*/}
                <Module>

                    <DeviceDetails deviceName={this.state.selectedDevice} />
                </Module>
            </section>

        )
    }
}