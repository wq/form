import React from "react";
import { Card, Typography, CardContent } from "@mui/material";
import { withWQ } from "@wq/react";
import PropTypes from "prop-types";

function Fieldset({ label, children }) {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                {label && (
                    <Typography color="textSecondary">{label}</Typography>
                )}
                {children}
            </CardContent>
        </Card>
    );
}

Fieldset.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
};

export default withWQ(Fieldset);
