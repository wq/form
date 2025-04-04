import React from "react";
import { withWQ } from "@wq/react";
import { Field } from "formik";
import HelperText from "./HelperText.js";
import PropTypes from "prop-types";

function Hidden(props) {
    return (
        <>
            <Field {...props} type="hidden" />
            <HelperText name={props.name} hint={props.hint} />
        </>
    );
}

Hidden.propTypes = {
    name: PropTypes.string,
    hint: PropTypes.string,
};

export default withWQ(Hidden);
