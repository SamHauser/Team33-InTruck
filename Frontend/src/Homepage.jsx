import { Component } from "react";
import Dashboard from "./modules/Dashboard";
import Tracking from "./modules/Tracking";
import NavBar from "./modules/NavBar";
import { Home, Logout, Map, Settings } from '@mui/icons-material'

const styles = {
    navBar: {
        marginRight: "15%"
    },
    body: {
        padding: "5%",
    }
}

const options = [
    [

        {
            name: "Dashboard",
            icon: <Home />,
            component: <Dashboard />
        },
        {
            name: "Tracking",
            icon: <Map />,
            component: <Tracking />
        }
    ],
    [

        {
            name: "Settings",
            icon: <Settings />
        },
        {
            name: "Logout",
            icon: <Logout />
        }
    ]
]

export default class Homepage extends Component {
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

        sessionStorage.setItem("lastPage", JSON.stringify(opt.name))
    }

    componentDidMount() {
        let lastPage = JSON.parse(sessionStorage.getItem("lastPage"))
        if (lastPage) {
            for (let arr of options) {
                for (let opt of arr) {
                    if (opt.name === lastPage) {
                        this.setState({
                            selOption: opt.name,
                            page: opt.component
                        })
                    }
                }
            }
        }
    }

    render() {
        return <section className="full">

            {/*Navigation Bar*/}
            <article style={styles.navBar}>
                <NavBar
                    selOption={this.state.selOption}
                    options={options}
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