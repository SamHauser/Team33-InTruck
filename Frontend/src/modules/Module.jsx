import { Component } from "react"

export default class Module extends Component {
    render() {
        return (<article className="module fg">
            {this.props.children}
        </article>)
    }
}