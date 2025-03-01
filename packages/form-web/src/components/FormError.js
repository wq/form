import React from "react";
import { withWQ } from "@wq/react";
import { useField } from "formik";
import { FormHelperText } from "@mui/material";

function FormError(props) {
    const [, { error }] = useField("__other__");
    if (!error) {
        return null;
    }
    return (
        <FormHelperText error {...props}>
            {error}
        </FormHelperText>
    );
}

export default withWQ(FormError);
