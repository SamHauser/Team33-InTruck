/**
 * PROPS
 * -----
 */
import { AcUnit, Lightbulb, LightbulbCircle, Visibility } from "@mui/icons-material"
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { Component } from "react"
import { COLOURS } from "../config"
import Title from "../fields/Title"

const styles = {
    container: {
        maxHeight: 200,
        overflow: "auto"
    },
    title: {
        marginBottom: "2%"
    }
}

const tempData = [
    {
        title: "AC Unit Online",
        description: "AC Unit in Truck 123 is back online",
        icon: <AcUnit />,
    },
    {
        title: "Movement Detected",
        description: "Detected movement in Truck 2319",
        icon: <Visibility />,
        colour: COLOURS[2]
    },
    {
        title: "AC Unit Offline",
        description: "AC Unit in Truck 123 has gone offline",
        icon: <AcUnit />,
        bgColour: COLOURS[2]
    },
    {
        title: "I ran out of ideas",
        description: "I, the frontend developer, ran out of ideas for dummy data",
        icon: <Lightbulb />,
        bgColour: COLOURS[2]
    },
]

export default class Alerts extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <article className="pad fullHeight">
                <Title label="Alerts" style={styles.title} />


                <List style={styles.container}>
                    {tempData.map((row, i) => (
                        <ListItem key={i}>
                            {/*Icon */}
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        color: row.colour,
                                        backgroundColor: row.bgColour
                                    }}
                                >
                                    {row.icon}
                                </Avatar>
                            </ListItemAvatar>

                            {/*Text */}
                            <ListItemText
                                primary={row.title}
                                secondary={row.description}
                                primaryTypographyProps={{
                                    color: "white"
                                }}
                                secondaryTypographyProps={{
                                    color: COLOURS[5]
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </article>
        )
    }
}