import React from "react";
import { withWQ } from "@wq/react";
import { Field } from "formik";
import { TextField } from "formik-mui";
import { useHtmlInput } from "@wq/form-common";
import PropTypes from "prop-types";

function Input({ hint, inputProps, ...rest }) {
    const { name, type, maxLength } = useHtmlInput(rest);
    return (
        <Field
            name={name}
            fullWidth
            margin="dense"
            component={TextField}
            helperText={hint}
            inputProps={{ maxLength, ...inputProps }}
            {...rest}
            type={type}
        />
    );
}

Input.propTypes = {
    name: PropTypes.string,
    hint: PropTypes.string,
    inputProps: PropTypes.object,
};

export default withWQ(Input);
