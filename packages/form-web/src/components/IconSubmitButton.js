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
        { isSubmitting } = useFormikContext();

    return <IconButton type="submit" disabled={isSubmitting} {...props} />;
}

export default withWQ(IconSubmitButton, { fallback: IconSubmitButtonFallback });
