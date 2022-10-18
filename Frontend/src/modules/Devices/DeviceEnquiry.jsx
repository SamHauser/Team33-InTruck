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


    render() {

        return (
            <section>
                {/*Selection*/}
                <Module>
                    <DeviceSelection onClick={this.handleDeviceSelect} />
                </Module>


                {/*Details*/}
                <Module>

                    <DeviceDetails deviceName={this.state.selectedDevice} />
                </Module>
            </section>

        )
    }
}