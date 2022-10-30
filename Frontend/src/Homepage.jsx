import { Component } from "react";
import Dashboard from "./modules/Dashboard";
import NavBar from "./modules/NavBar";
import { Home, Logout, Map, People } from '@mui/icons-material'
import Login from "./login";
import LogoutPage from "./logout";
import Users from "./modules/Users/Users";
import DeviceEnquiry from "./modules/Devices/DeviceEnquiry";

const styles = {
    navBar: {
        marginRight: "max(15%,150px)",
    },
    body: {
        padding: "3% 3% 0 3%",
    },
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
            component: <DeviceEnquiry />
        }
    ],
    [

        {
            name: "Users",
            icon: <People />,
            component: <Users />
        },
        {
            name: "Logout",
            icon: <Logout />,
            component: <LogoutPage />
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
        if (!sessionStorage.getItem("token")) {
            return <Login />

        } else {
            return (
                <section className="full">
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
            )
        }
    }
}