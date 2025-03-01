import React, { useEffect } from "react";
import { createFallbackComponent, useComponents, withWQ } from "@wq/react";
import PropTypes from "prop-types";

const DrawFallback = {
    components: {
        Geojson: createFallbackComponent("Geojson", "@wq/form", "AutoForm"),
        useMapInstance: createFallbackComponent(
            "useMapInstance",
            "@wq/form",
            "AutoForm"
        ),
    },
};

function Draw({ name, data, setData }) {
    const { Geojson, useMapInstance } = useComponents(),
        map = useMapInstance(name);

    useEffect(() => {
        if (!map) {
            return;
        }
        map.on("click", onClick);
        function onClick(evt) {
            setData(evt.geometry);
        }
        return () => map.off("click", onClick);
    }, [map]);

    if (!data) {
        return null;
    }
    return <Geojson active data={data} />;
}

Draw.propTypes = {
    name: PropTypes.string,
    data: PropTypes.object,
    setData: PropTypes.func,
};

export default withWQ(Draw, { fallback: DrawFallback });
