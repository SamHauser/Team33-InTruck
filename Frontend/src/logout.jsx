/*
    PROPS
    -----
*/

import { Component } from "react"

export default class LogoutPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        sessionStorage.removeItem("logged-in")
        sessionStorage.setItem("lastPage", JSON.stringify("Dashboard"))
        window.open("./", "_self")
    }

    render() {

        return (
            <article>
            </article>
        )
    }

}