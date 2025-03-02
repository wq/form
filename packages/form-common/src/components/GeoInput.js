import React from "react";
import {
    useComponents,
    withWQ,
    createFallbackComponent,
    createFallbackComponents,
} from "@wq/react";
import { Fieldset } from "./AutoSubform.js";
import GeoAccuracy from "./GeoAccuracy.js";
import GeoTools from "./GeoTools.js";
import { AutoMap, useFeatureCollection, asGeometry } from "@wq/map";
import { useField } from "formik";
import PropTypes from "prop-types";

export const TYPE_MAP = {
    geopoint: "point",
    geotrace: "line_string",
    geoshape: "polygon",
};

const GeoInputDefault = {
        components: {
            AutoMap,
            GeoAccuracy,
            GeoTools,
        },
    },
    GeoInputFallback = {
        components: {
            Fieldset,
            MapProvider: createFallbackComponent(
                "MapProvider",
                "@wq/map-gl",
                "MapProvider"
            ),
            ...createFallbackComponents(
                ["FlatFieldset", "HelperText", "Draw"],
                "@wq/form",
                "AutoForm"
            ),
        },
    };

function GeoInput({
    name,
    type,
    mapId = undefined,
    required,
    label,
    hint,
    inset = true,
    children,
}) {
    const {
            MapProvider,
            AutoMap,
            GeoAccuracy,
            GeoTools,
            Fieldset: DefaultFieldset,
            FlatFieldset,
            HelperText,
            Draw,
        } = useComponents(),
        [, { value }, { setValue }] = useField(name),
        [, { value: accuracy }, { setValue: setAccuracy }] = useField(
            `${name}_accuracy`
        ),
        maxGeometries = 1; // FIXME;

    const geojson = useFeatureCollection(value),
        drawType = TYPE_MAP[type] || "all",
        Fieldset = inset ? DefaultFieldset : FlatFieldset;

    function handleChange(geojson) {
        setValue(asGeometry(geojson, maxGeometries));
        if (accuracy) {
            setAccuracy(null);
        }
    }

    return (
        <MapProvider>
            <Fieldset label={label}>
                <GeoTools name={name} type={type} mapId={mapId} />
                <AutoMap
                    name={name}
                    mapId={mapId}
                    containerStyle={{ minHeight: 400 }}
                    context={emptyContext}
                    toolbarAnchor="bottom-right"
                >
                    {children}
                    <GeoAccuracy accuracy={accuracy} data={geojson} />
                    <Draw
                        name={name}
                        type={drawType}
                        required={required}
                        data={geojson}
                        setData={handleChange}
                    />
                </AutoMap>
                <HelperText name={name} hint={hint} />
            </Fieldset>
        </MapProvider>
    );
}

GeoInput.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    mapId: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.string,
    hint: PropTypes.string,
    inset: PropTypes.bool,
    children: PropTypes.node,
};

const emptyContext = {};

export default withWQ(GeoInput, {
    default: GeoInputDefault,
    fallback: GeoInputFallback,
});
