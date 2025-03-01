import React from "react";
import { useComponents, withWQ, createFallbackComponent } from "@wq/react";
import PropTypes from "prop-types";

const FlatFieldsetFallback = {
    components: {
        Typography: createFallbackComponent("Typography", "@wq/material"),
    },
};

function FlatFieldset({ label, children }) {
    const { Typography } = useComponents();
    return (
        <>
            <Typography color="textSecondary">{label}</Typography>
            {children}
        </>
    );
}

FlatFieldset.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
};

export default withWQ(FlatFieldset, { fallback: FlatFieldsetFallback });
