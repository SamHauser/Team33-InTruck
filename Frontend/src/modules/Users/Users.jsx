/**
 * PROPS
 * -----
 */

import { Component } from "react"
import Title from "../../fields/Title"
import PeerTable2 from "../../generics/PeerTable2"
import UserCreator from "./UserCreator"

const styles = {
}

export default class Users extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userOpen: false,
            username: ""
        }
    }

    handleDetailsClose = () => {
        this.setState({
            userOpen: false
        })
    }

    handleRow = row => {
        this.setState({
            userOpen: true,
            username: row.row.username
        })
    }

    render() {
        return (
            <article>
                <Title
                    label="Users"
                />

                {/*User Details*/}
                <UserCreator
                    open={this.state.userOpen}
                    username={this.state.username}
                    onClose={this.handleDetailsClose}
                />

                {/*Users List*/}
                <PeerTable2
                    url="users/getAll"
                    columns={dataFormat}
                    onRowClick={this.handleRow}
                />


            </article>

        )
    }
}

const dataFormat = [
    {
        flex: 1,
        field: "username",
        headerName: "Username",
    },
    {
        flex: 1,
        field: "first_name",
        headerName: "First Name",
    },
    {
        flex: 1,
        field: "last_name",
        headerName: "Last Name",
    },
]