/**
 * PROPS
 * -----
 */

import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import { Component } from "react"
import { COLOURS } from "./config"
import Input from "./fields/Input"
import { apiLoginCall, apiTokenCall } from "./generics/APIFunctions"

const styles = {
    card: {
        backgroundColor: COLOURS[1]
    },
    truck: {
        color: "white"
    },
    username: {
        marginBottom: "3%"
    },
    errMsg: {
        color: "red"
    }
}

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            errMsg: ""
        }
    }

    handleFields = ev => {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    }

    handleKey = ev => {
        if (ev.key === "Enter") {
            this.handleLogin()
        }
    }

    handleLogin = (devMode) => {
        const { username, password } = this.state
        if (devMode) {
            this.GETlogin("frontend", "spectreplum")
            return
        }

        //Validation
        let errMsg = ""
        if (username === "") { errMsg = "Username is empty" }
        if (password === "") { errMsg = "Password is empty" }


        //If validation fails
        if (errMsg !== "") {
            this.setState({
                errMsg: errMsg
            })
            return
        }

        this.GETlogin(username, password)
    }

    GETlogin = (username, password) => {
        const url = `users/login/${username}, ${btoa(password)}`
        const callback = d => {
            if (d.code === 200) {
                this.GETtoken(username, password)
            } else {
                this.setState({
                    errMsg: "Incorrect Username or Password"
                })
            }

        }
        const error = e => {
            console.error(e)
        }

        apiLoginCall(url, callback, error)
    }

    GETtoken = (username, password) => {
        const url = `users/token`
        const body = `username=${username}&password=${btoa(password)}`
        const callback = d => {
            sessionStorage.setItem("token", d.access_token)
            window.open('./', "_self")
        }
        const error = e => {
            console.error(e)
        }
        apiTokenCall(url, body, callback, error)
    }

    render() {
        return (
            <article className="center full itemsCenter">
                <Card style={styles.card}>
                    {/*Title*/}
                    <CardContent>
                        <section className="fullWidth center">
                            <Typography variant="h3" className="fg">
                                In<span style={styles.truck}>Truck</span>
                            </Typography>
                        </section>
                    </CardContent>

                    {/*Inputs */}
                    <CardContent>
                        <Input
                            label="Username"
                            name="username"
                            error={this.state.errMsg.includes("Username")}
                            value={this.state.username}
                            onChange={this.handleFields}
                            style={styles.username}
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            error={this.state.errMsg.includes("Password")}
                            value={this.state.password}
                            onChange={this.handleFields}
                        />

                        <p style={styles.errMsg}>
                            {this.state.errMsg}
                        </p>
                    </CardContent>

                    {/*Button */}
                    <CardActions className="center">
                        <Button
                            size="large"
                            onClick={() => this.handleLogin(false)}
                        >
                            Login
                        </Button>
                    </CardActions>

                    {/*Dev Button */}
                    <CardActions className="center">
                        <Button
                            size="large"
                            onClick={() => this.handleLogin(true)}
                        >
                            DEV LOGIN
                        </Button>
                    </CardActions>
                </Card>
            </article>

        )
    }
}