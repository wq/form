import React, { useState, useEffect, useRef } from "react";
import {
    useComponents,
    useMessage,
    withWQ,
    createFallbackComponent,
} from "@wq/react";
import PropTypes from "prop-types";

const GeoLocateFallback = {
    messages: {
        GEO_START_GPS: "Start GPS",
        GEO_STOP_GPS: "Stop GPS",
    },
    components: {
        Button: createFallbackComponent("Button", "@wq/material"),
        Typography: createFallbackComponent("Typography", "@wq/material"),
        useGeolocation: createFallbackComponent(
            "useGeolocation",
            "@wq/map-gl",
            "MapProvider",
        ),
    },
};

function GeoLocate({ type, setLocation, value, accuracy }) {
    const { Button, Typography, useGeolocation } = useComponents(),
        geolocation = useGeolocation(),
        [gpsStatus, setGpsStatus] = useState(""),
        gpsWatch = useRef();

    async function startGps() {
        if (gpsWatch.current) {
            return;
        }
        if (!geolocation.supported) {
            setGpsStatus("Geolocation not supported");
            return;
        }
        const watchId = await geolocation.watchPosition(onPosition, onError, {
            enableHighAccuracy: true,
            timeout: 60 * 1000,
        });

        gpsWatch.current = watchId;
        setGpsStatus("Determining location...");
    }

    function onPosition(evt) {
        const lat = +evt.coords.latitude.toFixed(6),
            lng = +evt.coords.longitude.toFixed(6),
            acc = +evt.coords.accuracy.toFixed(3);
        setLocation({
            longitude: lng,
            latitude: lat,
            accuracy: acc,
            zoom: true,
            save: type === "geopoint",
        });

        setGpsStatus(formatLoc(lat, lng, acc));
    }

    function onError(error) {
        let message;
        if (error.message) {
            message = error.message;
        } else if (error.code) {
            switch (error.code) {
                case 1:
                    message = "Permission denied";
                    break;
                case 2:
                    message = "Position unavailable";
                    break;
                case 3:
                    message = "Timeout expired";
                    break;
                default:
                    message = `Error code ${error.code}`;
            }
        } else {
            message = `Error: ${error}`;
        }
        setGpsStatus(message);
        stopGps();
    }

    function stopGps() {
        if (gpsWatch.current) {
            geolocation.clearWatch(gpsWatch.current);
        }
        gpsWatch.current = null;
    }

    function resetGps() {
        stopGps();
        setGpsStatus("");
    }

    useEffect(() => {
        return () => stopGps();
    }, []);

    const gpsActive = !!gpsWatch.current,
        gpsMessage = useMessage(gpsActive ? "GEO_STOP_GPS" : "GEO_START_GPS"),
        valueStatus =
            value &&
            value.type === "Point" &&
            value.coordinates &&
            formatLoc(value.coordinates[1], value.coordinates[0], accuracy);

    return (
        <>
            <Typography
                style={{
                    marginRight: 8,
                    flex: 1,
                    textAlign: "center",
                }}
                color="textSecondary"
            >
                {gpsStatus || valueStatus || ""}
            </Typography>
            <Button
                icon={gpsActive ? "gps-stop" : "gps-start"}
                style={{ minWidth: 140 }}
                variant={gpsActive ? "contained" : "outlined"}
                color="secondary"
                onClick={gpsActive ? resetGps : startGps}
            >
                {gpsMessage}
            </Button>
        </>
    );
}

GeoLocate.toolLabel = "Current";

GeoLocate.propTypes = {
    type: PropTypes.string,
    setLocation: PropTypes.func,
    value: PropTypes.object,
    accuracy: PropTypes.number,
};

function formatLoc(lat, lng, acc) {
    const latFmt = lat > 0 ? lat + "°N" : -lat + "°S",
        lngFmt = lng > 0 ? lng + "°E" : -lng + "°W",
        accFmt =
            acc > 1000
                ? " (~" + Math.round(acc / 1000) + "km)"
                : acc > 1
                  ? " (~" + Math.round(acc) + "m)"
                  : acc
                    ? " (" + acc + "m)"
                    : "";
    return `${latFmt} ${lngFmt}${accFmt}`;
}

const GeoLocateWQ = withWQ(GeoLocate, { fallback: GeoLocateFallback });
GeoLocateWQ.toolLabel = "Current";
export default GeoLocateWQ;
