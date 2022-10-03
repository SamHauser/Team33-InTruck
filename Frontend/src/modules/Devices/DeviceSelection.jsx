/**
 * PROPS
 * -----
 */

import { List, ListItemButton, ListItemText } from "@mui/material"
import { Component } from "react"
import { apiGetCall } from "../../generics/APIFunctions"

const styles = {
    selectionHeader: {
        padding: "0 10px"
    }
}

export default class DeviceSelection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            devices: []
        }
    }

    handleClick = device => {
        if (this.props.onClick) {
            this.props.onClick(device)
        }
    }

    GETdevices = () => {
        const url = "device/getDeviceNames/"
        const callback = data => {
            this.setState({
                devices: data.values
            })
        }

        const error = e => {
            console.error(e)
        }
        apiGetCall(url, callback, error)
    }

    componentDidMount() {
        this.GETdevices()
    }

    render() {
        const { devices } = this.state
        return (
            <article>
                <h2 style={styles.selectionHeader}>Device Selection</h2>
                <List
                    sx={{
                        maxHeight: 300,
                        overflow: "auto"
                    }}
                >
                    {devices.map((device, i) => (
                        <ListItemButton
                            key={i}
                            onClick={() => this.handleClick(device)}
                        >
                            <ListItemText primary={device} />
                        </ListItemButton>
                    ))}
                </List>
            </article>

        )
    }
}