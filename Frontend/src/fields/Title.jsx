/**
 * PROPS
 * -----
 * label
 * style - for overloading styles
 */
import { Component } from "react"

const styles = {
    txt: {
        marginTop: 0,
        marginBottom: "3%"
    }
}
export default class Title extends Component {

    render() {
        let style = styles.txt
        if (this.props.style) {
            style = {
                ...style,
                ...this.props.style
            }
        }

        return (
            <h1
                className="fl"
                style={style}
            >
                {this.props.label}
            </h1>
        )
    }
}