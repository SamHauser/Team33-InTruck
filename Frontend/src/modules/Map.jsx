/*
    PROPS
    -----
    markers - array of {lat,long}
*/

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

const markers = [
    {
        lat: -37.8243913,
        long: 145.0396567
    },
    {
        lat: -37.823524,
        long: 145.043003
    },
    {
        lat: -37.820710,
        long: 145.045451
    }
]

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: 10,
            height: 358,
            width: 1120,
        };
        this.mapContainer = React.createRef();
    }

    setMarkers = () => {
        const { zoom } = this.state;
        //Set default marker if 
        let markers = []
        let lats = [0]
        let longs = [0]
        if (this.props.markers) {
            markers = this.props.markers
            lats = []
            longs = []
        }

        //Get average latitudes and longitudes
        let minLat = Infinity, maxLat = -Infinity
        let minLong = Infinity, maxLong = -Infinity
        for (let mark of markers) {

            lats.push(mark.lat)
            longs.push(mark.long)

            if (mark.lat < minLat) { minLat = mark.lat }
            if (mark.lat > maxLat) { maxLat = mark.lat }

            if (mark.long < minLong) { minLong = mark.long }
            if (mark.long > maxLong) { maxLong = mark.long }
        }
        const lat = lats.reduce((a, b) => a + b) / lats.length
        const long = longs.reduce((a, b) => a + b) / longs.length

        //Set boundaries just outside furthest pins
        const bounds = this.props.markers ? [
            [minLong - 0.011, minLat - 0.011],
            [maxLong + 0.011, maxLat + 0.011]
        ] : [[-90, -90], [90, 90]]


        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/rossington55/cl31so9i2000014mvrbi6s0oc',
            center: [long, lat],
            zoom: zoom
        });
        map.fitBounds(bounds)

        //Set marker styles
        const el = document.createElement('div');


        //Add markers to map
        for (let mark of markers) {
            const marker = new mapboxgl.Marker()
                .setLngLat([mark.long, mark.lat])
                .addTo(map);
        }

    }
    componentDidMount() {
        this.setMarkers()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.markers !== this.props.markers) {
            this.setMarkers()
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