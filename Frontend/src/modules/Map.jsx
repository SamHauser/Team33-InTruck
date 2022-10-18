/*
    PROPS
    -----
    markers - array of {lat,long}
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { LocalShipping } from '@mui/icons-material';
import { COLOURS } from '../config';
import { Tooltip } from '@mui/material';
import { arrMatch } from '../generics/GeneralFunctions';

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
            bounds: bounds,
            boxZoom: false,
        });
        map.fitBounds(bounds)

        //Set marker styles
        const style = {
            color: COLOURS[2]
        }
        const textStyle = {
            color: COLOURS[5]
        }

        //Add markers to map
        for (let mark of markers) {
            //Boilerplate
            const el = document.createElement('div');
            const root = ReactDOM.createRoot(el)

            //Marker element
            const markerEl =
                <Tooltip title={mark.name}>
                    <LocalShipping style={style} />
                </Tooltip>
            root.render(markerEl)

            const marker = new mapboxgl.Marker(el)
                .setLngLat([mark.long, mark.lat])
                .addTo(map);
        }

    }
    componentDidMount() {
        this.setMarkers()
    }

    componentDidUpdate(prevProps) {
        if (!arrMatch(prevProps.markers, this.props.markers)) {
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