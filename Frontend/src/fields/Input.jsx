/**
 * PROPS
 * -----
 */

import { TextField } from "@mui/material"
import { Component } from "react"

const styles = {
    input: {
        color: "white",
    }
}

export default class Input extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {
        return (
            <div style={this.props.style ? this.props.style : {}}>
                <TextField
                    variant="outlined"
                    InputLabelProps={{
                        style: styles.input
                    }}
                    InputProps={{
                        style: styles.input
                    }}
                    {...this.props}
                />
            </div>

        )
    }
}