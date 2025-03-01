import React, { Fragment } from "react";
import { useComponents, useMessage, withWQ } from "@wq/react";
import PropTypes from "prop-types";

export const TYPE_MAP = {
    geopoint: "point",
    geotrace: "line_string",
    geoshape: "polygon",
};

const GeoHelpDefault = {
        messages: {
            GEO_POINT_NEW: "Click the {POINT_ICON} tool to draw a new point.",
            GEO_POINT_EDIT:
                "Select the existing point to move it, or click the {POINT_ICON} tool to draw a new point.",
            GEO_LINE_STRING_NEW:
                "Click the {LINE_ICON} tool to draw a new line.",
            GEO_LINE_STRING_EDIT:
                "Select the existing line to move it or its vertices.",
            GEO_POLYGON_NEW:
                "Click the {LINE_ICON} tool to draw a new polygon.",
            GEO_POLYGON_EDIT:
                "Select the existing polygon to move it or its vertices.",
        },
    },
    GeoHelpFallback = {
        components: {
            Typography: Fragment,
            GeoHelpIcon({ name }) {
                return `{${name}}`;
            },
        },
    };

function GeoHelp({ value, type }) {
    const drawType = TYPE_MAP[type] || type,
        { Typography, GeoHelpIcon } = useComponents(),
        messageId = `GEO_${drawType.toUpperCase()}_${value ? "EDIT" : "NEW"}`,
        messageTemplate = useMessage(messageId),
        message = [];

    if (messageTemplate) {
        messageTemplate.split("{").forEach((part) => {
            if (message.length === 0) {
                message.push(part);
                return;
            }
            const [iconName, ...rest] = part.split("}");

            message.push(<GeoHelpIcon name={iconName} type={drawType} />);
            message.push(rest.join("}"));
        });
    }
    return (
        <Typography
            color="textSecondary"
            style={{ flex: 1, textAlign: "right" }}
        >
            {message}
        </Typography>
    );
}

GeoHelp.toolLabel = false;
GeoHelp.toolDefault = true;

GeoHelp.propTypes = {
    value: PropTypes.object,
    type: PropTypes.string,
};

export default withWQ(GeoHelp, {
    default: GeoHelpDefault,
    fallback: GeoHelpFallback,
});
