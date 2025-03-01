import React from "react";
import {
    useMessage,
    useComponents,
    withWQ,
    createFallbackComponent,
} from "@wq/react";

const CancelButtonFallback = {
    messages: {
        CANCEL: "Cancel",
    },
    components: {
        ButtonLink: createFallbackComponent("ButtonLink", "@wq/material"),
    },
};

function CancelButton(props) {
    const { ButtonLink } = useComponents(),
        defaultLabel = useMessage("CANCEL"),
        label = props.children || defaultLabel;

    return <ButtonLink {...props}>{label}</ButtonLink>;
}

export default withWQ(CancelButton, { fallback: CancelButtonFallback });
