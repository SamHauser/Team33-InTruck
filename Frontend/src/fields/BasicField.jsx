/*
    Name
    -------------
    Harrison F    June 2020


    

    PROPS
    --------------
      
 */

import { TextField } from '@mui/material';
import React, { Component } from 'react';
import { COLOURS, FIELD_WIDTH } from '../config';
import SelectField from './SelectField';

const neglectTypes = ["timeN"]
export default class BasicField extends Component {
    render() {
        if (this.props.select && this.props.select !== "base") {
            return <SelectField {...this.props} />
        } else if (this.props.type === "empty") {
            return <div
                style={{
                    ...this.props.style,
                    ...{
                        width: FIELD_WIDTH,
                    }
                }}
            />
        }

        return (

            <TextField
                {...this.props}
                select={this.props.select === "base"}
                sx={{
                    "& .MuiOutlinedInput-root":
                    {
                        "& > fieldset":
                        {
                            borderColor: COLOURS[3],
                        }

                    },
                    "& .MuiSelect-outlined": {
                        paddingTop: "10px",
                        paddingBottom: "10px",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                        "-webkitTextFillColor": "#a0a0a0",
                    },
                    "& .MuiInputBase-root.Mui-disabled": {
                        "& > fieldset":
                        {
                            borderColor: COLOURS[3]
                        }
                    },
                }}
                variant={this.props.variant ? this.props.variant : "outlined"}
                style={{
                    ...this.props.style,
                    ...{
                        width: this.props.width ? this.props.width : FIELD_WIDTH,
                        height: this.props.multiline ? 25 * this.props.lines : 40,
                        color: "white"
                    }
                }}
                inputProps={{
                    style: {
                        padding: 10,
                        color: "white",
                    },
                    "data-testid": this.props.name
                }}
                InputLabelProps={{
                    style: {
                        color: COLOURS[3],
                    },
                    shrink: true
                }}
            />
        );
    }
}
