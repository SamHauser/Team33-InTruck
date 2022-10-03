/*
    Name
    -------------
    Harrison F    June 2022


    

    PROPS
    --------------
    url - if passing by url
    dataKey - if the data is within a child of the body, this is the name of the child
    data - if not using url
    bump
    columns - the format of the table

      
 */

import { DataGrid } from '@mui/x-data-grid';
import React, { Component } from 'react';
import { apiGetCall } from './APIFunctions';



export default class PeerTable2 extends Component {


    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }


    formatFromAPI = da => {
        for (let i in da) {
            //Store the id coming from the backend in the rowId column
            if (da[i].id) {
                da[i].rowId = da[i].id
            }
            da[i].id = i
        }

        this.setState({
            data: da
        })
    }

    GETdata = () => {
        const url = this.props.url
        this.setState({
            data: []
        })

        const callback = da => {
            if (this.props.dataKey) {
                da = da[this.props.dataKey]
            }

            this.formatFromAPI(da)

        }

        const error = e => {
            console.error(e)
        }

        apiGetCall(url, callback, error)
    }

    componentDidMount() {
        if (this.props.url) {
            this.GETdata()
        } else if (this.props.data) {
            this.formatFromAPI(this.props.data)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.bump !== this.props.bump) {
            if (this.props.url) {
                this.GETdata()
            } else {
                this.formatFromAPI(this.props.data)
            }
        }
    }

    render() {

        return (
            <DataGrid
                autoHeight
                rows={this.state.data}
                pageSize={!this.props.pageSize ? 10 : ""}
                {...this.props}
            />
        );
    }
}
