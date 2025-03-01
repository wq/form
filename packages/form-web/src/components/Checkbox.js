import React from "react";
import { withWQ } from "@wq/react";
import { Field } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import HelperText from "./HelperText.js";
import PropTypes from "prop-types";

function Checkbox({ label, ...props }) {
    return (
        <>
            <Field
                component={CheckboxWithLabel}
                Label={{ label }}
                {...props}
                type="checkbox"
            />
            <HelperText name={props.name} hint={props.hint} />
        </>
    );
}

Checkbox.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    hint: PropTypes.string,
};

export default withWQ(Checkbox);
