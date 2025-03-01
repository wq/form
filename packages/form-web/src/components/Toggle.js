import React from "react";
import { withWQ } from "@wq/react";
import { Field } from "formik";
import { ToggleButton, FormControl, FormLabel } from "@mui/material";
import { ToggleButtonGroup } from "formik-mui";
import HelperText from "./HelperText.js";
import PropTypes from "prop-types";

function Toggle({ choices, label, ...rest }) {
    return (
        <FormControl component="fieldset" fullWidth margin="dense">
            <FormLabel component="legend">{label}</FormLabel>
            <Field
                component={ToggleButtonGroup}
                exclusive
                {...rest}
                type="checkbox"
            >
                {choices.map(({ name, label }) => (
                    <ToggleButton key={name} value={name}>
                        {label}
                    </ToggleButton>
                ))}
            </Field>
            <HelperText name={rest.name} hint={rest.hint} />
        </FormControl>
    );
}

Toggle.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
};

export default withWQ(Toggle);
