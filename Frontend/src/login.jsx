/**
 * PROPS
 * -----
 */

import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import { Component } from "react"
import { COLOURS } from "./config"
import Input from "./fields/Input"

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

    handleLogin = () => {
        //Validation
        let errMsg = ""
        if (this.state.username === "") { errMsg = "Username is empty" }
        if (this.state.password === "") { errMsg = "Password is empty" }


        //If validation fails
        if (errMsg !== "") {
            this.setState({
                errMsg: errMsg
            })
            return
        }

        sessionStorage.setItem("logged-in", "true")
        window.open('./', "_self")
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
                            onClick={this.handleLogin}
                        >
                            Login
                        </Button>
                    </CardActions>
                </Card>
            </article>

        )
    }
}