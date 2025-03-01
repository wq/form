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

function DeleteForm({ action }) {
    const { Form, SubmitButton, View, HorizontalView } = useComponents(),
        message = useMessage("CONFIRM_DELETE");

    function confirmSubmit() {
        return window.confirm(message);
    }

    return (
        <Form
            action={action}
            method="DELETE"
            backgroundSync={false}
            onSubmit={confirmSubmit}
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
};

export default withWQ(DeleteForm, { fallback: DeleteFormFallback });
