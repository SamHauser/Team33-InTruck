/// app.js
import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

// Set your mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9zc2luZ3RvbjU1IiwiYSI6ImNsMzF0ZG9jZTIyam4zaXAyaGZjNWhkZGMifQ.sHPj8kR1E4e_cCc6TCCEqg';

const styles = {
    container: {
        padding: 7
    },
    map: {
        width: "100%",
        height: "100%",
        borderRadius: 5
    }
}

export default class TestMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 145.038444,
            lat: -37.822661,
            zoom: 13,
            height: 358,
            width: 1120,
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        const { lng, lat, zoom } = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/rossington55/cl31so9i2000014mvrbi6s0oc',
            center: [lng, lat],
            zoom: zoom
        });

        //Get average height and width of other info items
        const iconBlock = document.getElementById("iconBlock")
        if (iconBlock) {
            const margin = window.getComputedStyle(iconBlock).marginRight.substring(0, 2)

            this.setState({
                height: (iconBlock.clientHeight * 2) + (margin * 1),
                width: (iconBlock.clientWidth * 6) + (margin * 5) - 14,
            })
        }
    }

    render() {

        return (
            <article style={
                {

                    ...styles.container,
                    ...{

                        height: this.state.height,
                        width: this.state.width
                    }
                }
            }>
                <div
                    ref={this.mapContainer}
                    style={styles.map}
                />
            </article>
        );
    }
}