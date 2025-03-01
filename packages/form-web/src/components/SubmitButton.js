import React from "react";
import {
    useMessage,
    useComponents,
    withWQ,
    createFallbackComponent,
} from "@wq/react";
import { useFormikContext } from "formik";

const SubmitButtonFallback = {
    messages: {
        SUBMIT: "Submit",
    },
    components: {
        Button: createFallbackComponent("Button", "@wq/material"),
    },
};

function SubmitButton(props) {
    const { Button } = useComponents(),
        defaultLabel = useMessage("SUBMIT"),
        label = props.children || defaultLabel,
        { isSubmitting } = useFormikContext();

    return (
        <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isSubmitting}
            {...props}
        >
            {label}
        </Button>
    );
}

export default withWQ(SubmitButton, { fallback: SubmitButtonFallback });
