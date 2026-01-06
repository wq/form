import React, { useEffect } from "react";
import { useComponents, withWQ, createFallbackComponent } from "@wq/react";
import { useField } from "formik";
import PropTypes from "prop-types";

const GeoCoordsFallback = {
    components: {
        IconButton: createFallbackComponent("IconButton", "@wq/material"),
        Input: createFallbackComponent("Input", "@wq/form", "AutoForm"),
    },
};

function GeoCoords({ name, value, type, setLocation }) {
    const { IconButton, Input } = useComponents(),
        longitudeName = `${name}_longitude`,
        latitudeName = `${name}_latitude`,
        [, { value: longitude }, { setValue: setLongitude }] =
            useField(longitudeName),
        [, { value: latitude }, { setValue: setLatitude }] =
            useField(latitudeName);

    useEffect(() => {
        if (type !== "geopoint") {
            return;
        }
        if (!(value && value.type === "Point" && value.coordinates)) {
            return;
        }
        const [longitude, latitude] = value.coordinates;
        setLongitude(longitude);
        setLatitude(latitude);
    }, [type, value]);

    function saveLatLong() {
        if (
            !latitude ||
            !longitude ||
            Math.abs(latitude) > 90 ||
            Math.abs(longitude) > 180
        ) {
            return;
        }
        setLocation({
            longitude,
            latitude,
            zoom: true,
            save: type === "geopoint",
        });
    }

    return (
        <>
            <Input
                name={name + "_latitude"}
                label="Latitude"
                type="decimal"
                inputProps={{
                    step: 0.000001,
                    min: -90,
                    max: 90,
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                style={{ marginRight: 4, flex: 1 }}
            />
            <Input
                name={name + "_longitude"}
                label="Longitude"
                type="decimal"
                inputProps={{
                    step: 0.000001,
                    min: -180,
                    max: 180,
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                style={{ marginLeft: 4, flex: 1 }}
            />
            <IconButton
                onClick={saveLatLong}
                icon="search"
                variant="filled"
                color="secondary"
            />
        </>
    );
}

GeoCoords.propTypes = {
    name: PropTypes.str,
    value: PropTypes.object,
    type: PropTypes.str,
    setLocation: PropTypes.func,
};

const GeoCoordsWQ = withWQ(GeoCoords, { fallback: GeoCoordsFallback });
GeoCoordsWQ.toolLabel = "Lat/Lng";
export default GeoCoordsWQ;
