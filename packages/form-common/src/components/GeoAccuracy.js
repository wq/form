import React from "react";
import { createFallbackComponent, useComponents, withWQ } from "@wq/react";
import circle from "@turf/circle";
import PropTypes from "prop-types";

const AccuracyFallback = {
    components: {
        Geojson: createFallbackComponent("Geojson", "@wq/form", "AutoForm"),
    },
};

function Accuracy({ accuracy, data }) {
    const { Geojson } = useComponents(),
        geometry =
            data &&
            data.features &&
            data.features[0] &&
            data.features[0].geometry;
    if (!accuracy || !geometry || geometry.type !== "Point") {
        return null;
    }
    const circleData = circle(geometry.coordinates, accuracy / 1000);

    return <Geojson name="accuracy" active data={circleData} />;
}

Accuracy.propTypes = {
    accuracy: PropTypes.number,
    data: PropTypes.object,
};

export default withWQ(Accuracy, { fallback: AccuracyFallback });
