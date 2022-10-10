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
            userOpen: false
        }
    }


    render() {
        return (
            <article>
                <Title
                    label="Users"
                />

                {/*User Details*/}
                <UserCreator />

                {/*Users List*/}
                <PeerTable2
                    columns={[]}
                    data={[]}
                />


            </article>

        )
    }
}