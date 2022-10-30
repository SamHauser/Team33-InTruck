/*
    Name
    -------------
    Harrison F    June 2020


    

    PROPS
    --------------
      
 */

import { MenuItem } from '@mui/material';
import React, { Component } from 'react';
import BasicField from './BasicField';

const styles = {

};

export default class SelectField extends Component {

    render() {
        return (
            <BasicField
                {...this.props}
                select="base"
                onClick={null}
            >
                {this.props.options.map((opt, i) => (
                    <MenuItem
                        key={i}
                        value={opt.value}
                        onClick={() => this.props.onSelect(opt)}
                    >
                        {opt.label}
                    </MenuItem>
                ))
                }
            </BasicField>
        );
    }
}
