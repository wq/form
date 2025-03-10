import React from "react";
import { withWQ } from "@wq/react";
import { useFormikContext, getIn } from "formik";
import { HelperText as FormHelperText } from "react-native-paper";
import PropTypes from "prop-types";

function HelperText({ name, hint }) {
    const { errors, touched } = useFormikContext(),
        error = getIn(errors, name),
        showError = !!error && !!getIn(touched, name);

    if (showError) {
        hint = error;
    }

    if (!hint) {
        return null;
    }

    return (
        <FormHelperText type={showError ? "error" : "info"}>
            {hint}
        </FormHelperText>
    );
}

HelperText.propTypes = {
    name: PropTypes.string,
    hint: PropTypes.string,
};

export default withWQ(HelperText);
