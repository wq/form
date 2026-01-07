import React from "react";
import {
    useComponents,
    useMessage,
    withWQ,
    createFallbackComponents,
} from "@wq/react";
import { Form } from "@wq/form-common";
import SubmitButton from "./SubmitButton.js";
import PropTypes from "prop-types";

const DeleteFormFallback = {
    messages: {
        CONFIRM_DELETE: "Are you sure you want to delete this record?",
    },
    components: {
        Form,
        SubmitButton,
        ...createFallbackComponents(["View", "HorizontalView"], "@wq/material"),
    },
};

function DeleteForm({ action, onSubmit, submitOptions }) {
    const { Form, SubmitButton, View, HorizontalView } = useComponents(),
        message = useMessage("CONFIRM_DELETE");

    function confirmSubmit(options) {
        if (window.confirm(message)) {
            if (onSubmit) {
                return onSubmit(options);
            } else {
                console.error("No onSubmit handler provided to DeleteForm");
            }
        }
    }

    return (
        <Form
            action={action}
            method="DELETE"
            onSubmit={confirmSubmit}
            submitOptions={submitOptions}
        >
            <HorizontalView>
                <View />
                <SubmitButton icon="delete" variant="text" color="secondary">
                    Delete
                </SubmitButton>
            </HorizontalView>
        </Form>
    );
}

DeleteForm.propTypes = {
    action: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    submitOptions: PropTypes.object,
};

export default withWQ(DeleteForm, { fallback: DeleteFormFallback });
