import React from "react";
import { withWQ, useComponents, createFallbackComponent } from "@wq/react";
import { useFormikContext } from "formik";

const SubmitButtonFallback = {
    components: {
        Button: createFallbackComponent("Button", "@wq/material"),
    },
};

function SubmitButton(props) {
    const { Button } = useComponents(),
        { isSubmitting, submitForm } = useFormikContext();

    return (
        <Button
            mode="contained"
            disabled={isSubmitting}
            onPress={submitForm}
            {...props}
        />
    );
}

export default withWQ(SubmitButton, { fallback: SubmitButtonFallback });
