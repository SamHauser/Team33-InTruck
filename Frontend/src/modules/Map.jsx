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

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: 10,
            height: 300,
            width: 880,
        };
        this.mapContainer = React.createRef();
    }

    handleMarkerClick = deviceName => {
        sessionStorage.setItem("lastPage", JSON.stringify("Tracking"))
        sessionStorage.setItem("lastDevice", deviceName)
        window.location.reload()
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
        let minLat = 90, maxLat = -90
        let minLon = 180, maxLon = -180
        for (let mark of markers) {
            lats.push(mark.lat)
            longs.push(mark.lon)

            if (mark.lat < minLat) { minLat = mark.lat }
            if (mark.lat > maxLat) { maxLat = mark.lat }

            if (mark.lon < minLon) { minLon = mark.lon }
            if (mark.lon > maxLon) { maxLon = mark.lon }
        }

        if (minLat === 90 && minLon === 90) {
            minLat = -90
            maxLat = 90
            minLon = -180
            maxLon = 180
        }

        //Set boundaries just outside furthest pins
        const bounds = this.props.markers ? [
            [minLon, minLat - 0.011],
            [maxLon + 0.011, maxLat + 0.011]
        ] : [[-180, -90], [180, 90]]


        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/rossington55/cl31so9i2000014mvrbi6s0oc',
            bounds: bounds,
            boxZoom: false,
        });
        if (!this.props.markers) { return }
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
            if (mark.lon === "No data" && mark.lat === "No data") { continue }

            //Boilerplate
            const el = document.createElement('div');
            const root = ReactDOM.createRoot(el)

            //Marker element
            const markerEl =
                <Tooltip
                    title={mark.name}
                >
                    <LocalShipping
                        style={style}
                        onClick={() => this.handleMarkerClick(mark.name)}
                    />
                </Tooltip>
            root.render(markerEl)

            const marker = new mapboxgl.Marker(el)
                .setLngLat([mark.lon, mark.lat])
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
            <article
                className='center itemsCenter selfCenter'
                style={
                    {

                        ...styles.container,
                        ...{

                            height: this.state.height,
                            width: this.state.width
                        }
                    }
                }>
                <div
                    className='selfCenter'
                    ref={this.mapContainer}
                    style={styles.map}
                />
            </article>
        );
    }
}