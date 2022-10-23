/*
    Lunchbox
    -------------
    Harrison Feldman    June 2020


    Contains multiple snackbars

    PROPS
    --------------
      openSnacks - array of ids of currently open snackbars 
      snacks: [
          {
            label,
            severity {success, warning, error, info},
          }
      ]
      onClose={(id) => {
                        var openSnacks = this.state.openSnacks;
                        openSnacks.splice(id, 1);
                        this.setState({ openSnacks: openSnacks });
                    }}
 */

import React, { Component } from 'react';
import { Snackbar, Alert } from '@mui/material';//Inputs

export class Lunchbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bump: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.openSnacks !== this.props.openSnacks) {
            this.setState({
                bump: !this.state.bump,
            });
        }
    }

    render() {
        const snacks = this.props.snacks;

        console.table(this.props)
        return (
            <article>
                {this.props.openSnacks.map((snack, id) => (
                    <Snackbar
                        key={id}
                        open={true}
                        onClose={() => { this.props.onClose(id) }}
                        autoHideDuration={2500}
                    >
                        <Alert
                            onClose={() => { this.props.onClose(id) }}
                            severity={snacks[snack].severity}
                        >
                            {snacks[snack].label}
                        </Alert>
                    </Snackbar >
                ))}
            </article>
        );

    }
}

export default (Lunchbox);