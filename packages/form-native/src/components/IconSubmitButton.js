import React from "react";
import { useComponents, withWQ, createFallbackComponent } from "@wq/react";
import { useFormikContext } from "formik";

const IconSubmitButtonFallback = {
    components: {
        IconButton: createFallbackComponent("IconButton", "@wq/material"),
    },
};

function IconSubmitButton(props) {
    const { IconButton } = useComponents(),
        { isSubmitting, submitForm } = useFormikContext();

    return (
        <IconButton disabled={isSubmitting} onPress={submitForm} {...props} />
    );
}

export default withWQ(IconSubmitButton, { fallback: IconSubmitButtonFallback });
