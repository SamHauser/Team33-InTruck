/*
    PROPS
    -----
    width - unit width * x
    height - unit height * y
*/

import { Component } from "react"

export default class Module extends Component {
    constructor(props) {
        super(props)
        this.state = {
            height: 0,
            width: 0
        }
    }

    componentDidMount() {
        //Get average height and width of other info items
        window.addEventListener('unit', () => {
            let height = ""
            let width = ""
            if (this.props.height) {

                height = JSON.parse(sessionStorage.getItem("unitHeights"))[this.props.height]
            }
            if (this.props.width) {
                width = JSON.parse(sessionStorage.getItem("unitWidths"))[this.props.width]
            }

            this.setState({
                height: height,
                width: width
            })
        })
    }

    render() {
        const style = {
            height: this.state.height,
            width: this.state.width
        }

        return (
            <article className="module fg" style={(this.props.width || this.props.height) ? style : {}}>
                {this.props.children}
            </article>
        )
    }
}