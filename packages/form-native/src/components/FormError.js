import React from "react";
import { withWQ } from "@wq/react";
import { useField } from "formik";
import { HelperText } from "react-native-paper";

function FormError(props) {
    const [, { error }] = useField("__other__");
    if (!error) {
        return null;
    }
    return (
        <HelperText type="error" {...props}>
            {error}
        </HelperText>
    );
}

export default withWQ(FormError);
