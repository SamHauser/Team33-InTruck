import { Component } from "react";
import Dashboard from "./modules/Dashboard";
import NavBar from "./modules/NavBar";

const styles = {
    navBar: {
        marginRight: "15%"
    },
    body: {
        padding: "5%",
    }
}

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selOption: "Dashboard",
            page: <Dashboard />
        }
    }

    handleOption = opt => {
        this.setState({
            selOption: opt.name,
            page: opt.component
        })
    }

    render() {
        return <section className="full">

            {/*Navigation Bar*/}
            <article style={styles.navBar}>
                <NavBar
                    selOption={this.state.selOption}
                    onClick={this.handleOption}
                />
            </article>

            {/*Page */}
            <article className="full">
                <article style={styles.body}>
                    {this.state.page}
                </article>
            </article>
        </section>
    }
}