import React, { useCallback, useEffect, useMemo } from "react";
import { useField } from "formik";
import { useComponents, withWQ, createFallbackComponent } from "@wq/react";
import GeoHelp from "./GeoHelp.js";
import GeoLocate from "./GeoLocate.js";
import GeoCode from "./GeoCode.js";
import GeoCoords from "./GeoCoords.js";
import PropTypes from "prop-types";

export function useZoomToLocation(mapId) {
    const { useMapInstance } = useComponents(),
        instance = useMapInstance(mapId);

    return useCallback(
        (geometry) => {
            if (geometry.type == "Point") {
                instance.flyTo({
                    center: geometry.coordinates,
                    zoom: 18,
                });
            } else {
                console.warn(
                    `zoomToLocation not implemented for ${geometry.type}`,
                );
            }
        },
        [instance],
    );
}

const GeoToolsDefaults = {
        components: {
            GeoHelp,
            GeoLocate,
            GeoCode,
            GeoCoords,
            useZoomToLocation,
        },
    },
    GeoToolsFallback = {
        components: {
            useMinWidth: createFallbackComponent("useMinWidth", "@wq/material"),
            View: createFallbackComponent("View", "@wq/material"),
            Toggle: createFallbackComponent("Toggle", "@wq/form", "AutoForm"),
        },
    };

export function useGeoTools(name, type, mapId) {
    const { useZoomToLocation } = useComponents(),
        zoomToLocation = useZoomToLocation(mapId),
        components = useComponents(),
        tools = useMemo(() => {
            const tools = {};
            for (const [key, value] of Object.entries(components)) {
                if (
                    (value.toolLabel || value.toolDefault) &&
                    !Object.values(tools).includes(value)
                ) {
                    tools[key] = value;
                }
            }
            return tools;
        }, [components]),
        toggleName = `${name}_method`,
        [, { value }, { setValue }] = useField(name),
        [, { value: accuracy }, { setValue: setAccuracy }] = useField(
            `${name}_accuracy`,
        ),
        [, { value: activeTool }, { setValue: setActiveTool }] =
            useField(toggleName);

    const [defaultTool, DefaultTool] = Object.entries(tools).find(
            ([, Tool]) => Tool.toolDefault,
        ) || [null, () => null],
        ActiveTool = tools[activeTool] || DefaultTool;

    const setLocation = useCallback(
        ({
            geometry = null,
            latitude = 0,
            longitude = 0,
            accuracy = null,
            zoom = true,
            save = false,
        }) => {
            if (!geometry) {
                geometry = {
                    type: "Point",
                    coordinates: [longitude, latitude],
                };
            }

            if (save) {
                setValue(geometry);
                setAccuracy(accuracy);
            }

            if (zoom && zoomToLocation) {
                zoomToLocation(geometry, {
                    name,
                    type,
                    activeTool,
                });
            }
        },
        [zoomToLocation],
    );

    useEffect(() => {
        if (
            !activeTool &&
            defaultTool &&
            ActiveTool == DefaultTool &&
            DefaultTool.toolLabel
        ) {
            setActiveTool(defaultTool);
        }
    }, [activeTool, ActiveTool]);

    return useMemo(
        () => ({
            toggleProps: {
                name: toggleName,
                choices: Object.entries(tools)
                    .filter(([, Tool]) => Tool.toolLabel)
                    .map(([key, Tool]) => ({
                        name: key,
                        label: Tool.toolLabel,
                    })),
            },
            setLocation,
            ActiveTool,
            value,
            accuracy,
        }),
        [toggleName, tools, setLocation, ActiveTool, value, accuracy],
    );
}

function GeoTools({ name, type, mapId }) {
    const { toggleProps, setLocation, ActiveTool, value, accuracy } =
            useGeoTools(name, type, mapId),
        { View, Toggle, useMinWidth } = useComponents(),
        singleRow = useMinWidth(600);

    if (singleRow) {
        return (
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <View style={{ marginRight: 8, minWidth: 200 }}>
                    <Toggle {...toggleProps} />
                </View>
                <ActiveTool
                    name={name}
                    value={value}
                    accuracy={accuracy}
                    type={type}
                    setLocation={setLocation}
                />
            </View>
        );
    } else {
        return (
            <>
                <View>
                    <Toggle label="Location Mode" {...toggleProps} />
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 8,
                        width: "100%",
                    }}
                >
                    <ActiveTool
                        name={name}
                        value={value}
                        accuracy={accuracy}
                        type={type}
                        setLocation={setLocation}
                    />
                </View>
            </>
        );
    }
}

GeoTools.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    mapId: PropTypes.string,
};

export default withWQ(GeoTools, {
    defaults: GeoToolsDefaults,
    fallback: GeoToolsFallback,
});
