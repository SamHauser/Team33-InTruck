/**
 * PROPS
 * -----
 * label
 */
import { Component } from "react"

const styles = {
    txt: {
        marginTop: 0
    }
}
export default class Title extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (<h1 className="fl" style={styles.txt}>{this.props.label}</h1>)
    }
}