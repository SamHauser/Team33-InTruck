/**
 * PROPS
 * -----
 */
import { Component } from "react"
import { DataGrid } from '@mui/x-data-grid';
import Module from "./Module"
import Title from "../fields/Title";
import TruckDetails from "./TruckDetails";

const data = [
    {
        id: 0,
        rego: "ABC123",
        driver: "Bob",
        address: "123 Street St",
        location: "123 Street St",
    },
    {
        id: 1,
        rego: "1AA 1AA",
        driver: "Alice",
        address: "123 Street St",
        location: "123 Street St",
    },
]

const cols = [
    {
        field: "id",
        headerName: "ID",
    },
    {
        field: "rego",
        headerName: "Registration",
        flex: 1
    },
    {
        field: "driver",
        headerName: "Driver",
        flex: 1
    },
    {
        field: "address",
        headerName: "Address",
        flex: 1
    }
]

const styles = {
    container: {
        color: "white",
    },
    table: {
        padding: "2%"
    },
    dataGrid: {
        color: "white",
        cursor: "pointer",
        border: 0,
        width: "100%"
    }
}

export default class Tracking extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selRow: null
        }
    }

    handleRow = row => {
        this.setState({
            selRow: row.row
        })
    }

    render() {
        return (
            <article>
                <Module>
                    <article style={styles.container} className="full">
                        <section className="pad">
                            <Title label="Tracking" />
                        </section>
                        <article style={styles.table}>
                            <DataGrid
                                autoHeight
                                autoPageSize
                                sx={styles.dataGrid}
                                rows={data}
                                columns={cols}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                onRowClick={this.handleRow}
                            />
                        </article>
                    </article>
                </Module>

                <Module>
                    <TruckDetails truck={this.state.selRow} />
                </Module>
            </article>

        )
    }
}