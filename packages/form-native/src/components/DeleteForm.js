import React from "react";
import {
    useComponents,
    useMessage,
    withWQ,
    createFallbackComponents,
} from "@wq/react";
import { Form } from "@wq/form-common";
import SubmitButton from "./SubmitButton.js";
import Alert from "react-native";
import PropTypes from "prop-types";

const DeleteFormFallback = {
    messages: {
        CONFIRM_DELETE: "Are you sure you want to delete this record?",
        CONFIRM_DELETE_TITLE: "Confirm Deletion",
        CONFIRM_DELETE_OK: "Yes, Delete",
        CONFIRM_DELETE_CANCEL: "Cancel",
    },
    components: {
        Form,
        SubmitButton,
        ...createFallbackComponents(["View", "HorizontalView"], "@wq/material"),
    },
};

function DeleteForm({ action }) {
    const { Form, SubmitButton, View, HorizontalView } = useComponents(),
        confirmDelete = useMessage("CONFIRM_DELETE"),
        confirmDeleteTitle = useMessage("CONFIRM_DELETE_TITLE"),
        confirmDeleteOk = useMessage("CONFIRM_DELETE_OK"),
        confirmDeleteCancel = useMessage("CONFIRM_DELETE_CANCEL");

    async function confirmSubmit() {
        return new Promise((resolve) => {
            Alert.alert(
                confirmDeleteTitle,
                confirmDelete,
                [
                    {
                        text: confirmDeleteCancel,
                        onPress() {
                            resolve(false);
                        },
                        style: "cancel",
                    },
                    {
                        text: confirmDeleteOk,
                        onPress() {
                            resolve(true);
                        },
                        style: "destructive",
                    },
                ],
                {
                    onDismiss() {
                        resolve(false);
                    },
                }
            );
        });
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
