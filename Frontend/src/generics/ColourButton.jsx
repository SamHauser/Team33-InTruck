/**
 * PROPS
 * -----
 */

import { LoadingButton } from "@mui/lab"
import { Button } from "@mui/material"
import { Component } from "react"
import { COLOURS } from "../config"

const styles = {
}

export default class ColourButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {
        const getColour = fill => {
            let colour = COLOURS[2]
            if (this.props.colour) {
                colour = this.props.colour
            }

            if (this.props.variant === "contained") {
                if (fill) {
                    return colour
                }
            } else {
                if (!fill) {
                    return colour
                }
            }
        }

        const sectionStyle = {
            width: this.props.width
        }

        const buttonStyle = {
            color: getColour(false),
            backgroundColor: getColour(true),
            borderColor: getColour(false),
            width: this.props.width,
            height: 36.5
        }

        return (
            <section style={sectionStyle} >

                {this.props.loading ?
                    <LoadingButton
                        {...this.props}
                        loading
                        style={{ ...this.props.style, ...buttonStyle }}
                        variant={this.props.variant ? this.props.variant : "outlined"}
                    />
                    :
                    <Button
                        {...this.props}
                        style={{ ...this.props.style, ...buttonStyle }}
                        variant={this.props.variant ? this.props.variant : "outlined"}
                    >{this.props.text}</Button>
                }
            </section>
        )
    }
}