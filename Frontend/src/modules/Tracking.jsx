/**
 * PROPS
 * -----
 */
import { Component } from "react"
import { DataGrid } from '@mui/x-data-grid';
import Module from "./Module"
import { COLOURS } from "../config";

const data = [
    {
        id: 0,
        rego: "ABC123",
        driver: "Bob",
        location: "123 Street St"
    },
    {
        id: 1,
        rego: "1AA 1AA",
        driver: "Alice",
        location: "123 Street St"
    },
]

const cols = [
    {
        field: "id", headerName: "ID", width: 50
    },
    {
        field: "rego", headerName: "Registration", width: 100
    },
    {
        field: "driver", headerName: "Driver"
    },
    {
        field: "location", headerName: "Address"
    }
]

const styles = {
    container: {
        color: "white",
    },
    table: {
        height: 500,
        padding: "2%"
    }
}

export default class Tracking extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <Module className="module">
                <article style={styles.container} className="full">
                    <article style={styles.table}>

                        <DataGrid
                            sx={{
                                color: "white",
                                cursor: "pointer",
                                border: 0
                            }}
                            rows={data}
                            columns={cols}
                            pageSize={5}
                            rowsPerPAgeOptions={[5]}
                            checkboxSelection
                        />
                    </article>
                </article>
            </Module>

        )
    }
}