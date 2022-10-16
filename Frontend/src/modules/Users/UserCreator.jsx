/**
 * PROPS
 * -----
 * open
 * username
 * onClose
 */

import { Button, ButtonGroup, Dialog, DialogContent } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Component } from "react"
import BasicField from "../../fields/BasicField"
import ColourButton from "../../generics/ColourButton"
import { COLOURS } from "../../config"
import { apiGetCall, apiPostCall } from "../../generics/APIFunctions"

const styles = {
    section: {
        marginBottom: 20
    },
    button: {
        marginBottom: "1%"
    },
    errMsg: {
        color: "red",
        maxWidth: 180
    }
}

export default class UserCreator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            errMsg: "",
            loading: false,
            user: {
                first_name: "",
                last_name: "",
                username: "",
                password: "",
                confPassword: "",
            }
        }
    }

    handleChange = ev => {
        let { user } = this.state
        user[ev.target.name] = ev.target.value

        this.setState({
            user: user
        })
    }

    handleCreateOpen = (mode) => {
        if (!mode) { this.props.onClose() }

        this.setState({
            open: !this.state.open,
            mode: mode
        })
    }

    handleSubmit = () => {
        let user = JSON.parse(JSON.stringify(this.state.user))
        let errMsg = ""
        this.setState({
            loading: true
        })

        //Validation
        if (user.first_name === "") {
            errMsg = "First Name is empty"
        } else if (user.last_name === "") {
            errMsg = "Last Name is empty"
        } else if (user.username === "") {
            errMsg = "Username is empty"
        } else if (user.password === "") {
            errMsg = "Password is empty"
        } else if (user.confPassword === "") {
            errMsg = "Confirmation password is empty"
        } else if (user.password !== user.confPassword) {
            errMsg = "Passwords don't match"
        }

        //Error found
        if (errMsg !== "") {
            this.setState({
                loading: false,
                errMsg: errMsg
            })
            return
        } else {
            this.setState({
                errMsg: ""
            })
        }


        //All good, no error found
        delete user.confPassword
        user.password = btoa(user.password)

        this.POSTuser(user)

    }

    POSTuser = (newUser) => {
        const url = "users/add"
        newUser = JSON.stringify(newUser)
        const callback = data => {
            console.log(data)
        }
        const error = e => {
            console.error(e)
        }

        apiPostCall(url, "POST", newUser, callback, error)
    }

    GETuser = () => {
        const url = `users/get/${this.props.username}`

        const callback = d => {
            d = d[0]
            this.handleCreateOpen("edit")

            this.setState({
                user: d
            })
        }
        const error = e => {
            console.error(e)
        }

        apiGetCall(url, callback, error)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.open !== this.props.open && this.props.open) {
            this.GETuser()
        }
    }


    render() {
        const { user } = this.state

        return (
            <article>
                {/*Create new Btn*/}
                <ColourButton
                    text="Create User"
                    variant="outlined"
                    style={styles.button}
                    onClick={() => this.handleCreateOpen("create")}
                />


                {/*Details */}
                <Dialog
                    open={this.state.open}
                    onClose={() => this.handleCreateOpen(false)}
                    fullWidth

                >
                    <DialogContent
                        className="fg"
                    >
                        <article>
                            {/*Username*/}
                            <section className="around">

                                <BasicField
                                    name="username"
                                    label="Username"
                                    value={user.username}
                                    disabled={this.state.mode === "edit"}
                                    error={this.state.errMsg.includes("Username")}
                                    onChange={this.handleChange}
                                />

                                <BasicField type="empty" />
                            </section>
                            <br />
                            {/* Name */}
                            <section className="around">
                                {/* First Name */}
                                <BasicField
                                    name="first_name"
                                    label="First Name"
                                    value={user.first_name}
                                    error={this.state.errMsg.includes("First Name")}
                                    onChange={this.handleChange}
                                />
                                {/* Last Name */}
                                <BasicField
                                    name="last_name"
                                    label="Last Name"
                                    value={user.last_name}
                                    error={this.state.errMsg.includes("Last Name")}
                                    onChange={this.handleChange}
                                />
                            </section>
                            <br />

                            {/*Password*/}
                            {this.state.mode === "create" &&
                                < section className="around">

                                    <BasicField
                                        name="password"
                                        label="Password"
                                        value={user.password}
                                        error={this.state.errMsg.includes("Password")}
                                        onChange={this.handleChange}
                                    />
                                    {/*Confirmation Password*/}
                                    <BasicField
                                        name="confPassword"
                                        label="Confirm Password"
                                        value={user.confPassword}
                                        error={this.state.errMsg.includes("Password")}
                                        onChange={this.handleChange}
                                    />
                                </section>
                            }

                            <br />
                            {/*Error Msg*/}
                            <span style={styles.errMsg}>{this.state.errMsg}</span>

                            {/*Submit*/}
                            <section className="fullWidth center">

                                <ColourButton
                                    onClick={this.handleSubmit}
                                    loading={this.state.loading}
                                    text="Submit"
                                    variant="contained"
                                    colour={COLOURS[3]}
                                    width={180}
                                />
                            </section>
                        </article>
                    </DialogContent>
                </Dialog>
            </article >

        )
    }
}