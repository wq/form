import React from "react";
import { useField } from "formik";
import { useComponents, withWQ, createFallbackComponent } from "@wq/react";
import AutoInput from "./AutoInput.js";
import Form from "./Form.js";
import CancelButton from "./CancelButton.js";
import { initFormData } from "../hooks.js";
import PropTypes from "prop-types";

const AutoFormBaseDefaults = {
        components: {
            AutoInput,
            Form,
            CancelButton,
        },
    },
    AutoFormBaseFallback = {
        components: {
            FormError() {
                const [, { error }] = useField("__other__");
                if (!error) {
                    return null;
                }
                return error;
            },
            SubmitButton: createFallbackComponent(
                "SubmitButton",
                "@wq/form",
                "AutoForm"
            ),
            View: createFallbackComponent("View", "@wq/material"),
            HorizontalView: createFallbackComponent(
                "HorizontalView",
                "@wq/material"
            ),
        },
    };

function AutoFormBase({
    action,
    cancel,
    method,
    onSubmit,
    hideSubmit,
    storage,
    backgroundSync,
    outboxId,
    form = [],
    modelConf,
    postSaveNav,
    data,
    csrftoken,
    error,
    FormRoot,
    children,
}) {
    const {
        AutoInput,
        Form,
        FormError,
        HorizontalView,
        View,
        CancelButton,
        SubmitButton,
    } = useComponents();

    const formData = initFormData(form, data);

    if (!modelConf) {
        modelConf = { form };
    }

    if (hideSubmit && !onSubmit) {
        onSubmit = () => false;
    }

    return (
        <Form
            action={action}
            method={method}
            onSubmit={onSubmit}
            data={formData}
            csrftoken={csrftoken}
            modelConf={modelConf}
            postSaveNav={postSaveNav}
            error={error}
            storage={storage}
            backgroundSync={backgroundSync}
            outboxId={outboxId}
            FormRoot={FormRoot}
        >
            {children}
            {(form || []).map(({ name, children: subform, ...rest }) => (
                <AutoInput key={name} name={name} subform={subform} {...rest} />
            ))}
            <FormError />
            {(cancel || !hideSubmit) && (
                <HorizontalView>
                    {cancel ? <CancelButton to={cancel} /> : <View />}
                    {hideSubmit ? <View /> : <SubmitButton />}
                </HorizontalView>
            )}
        </Form>
    );
}

AutoFormBase.propTypes = {
    action: PropTypes.string,
    cancel: PropTypes.object,
    method: PropTypes.string,
    onSubmit: PropTypes.func,
    hideSubmit: PropTypes.bool,
    storage: PropTypes.string,
    backgroundSync: PropTypes.bool,
    outboxId: PropTypes.number,
    form: PropTypes.arrayOf(PropTypes.object),
    modelConf: PropTypes.object,
    postSaveNav: PropTypes.func,
    data: PropTypes.object,
    csrftoken: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    FormRoot: PropTypes.func,
    children: PropTypes.node,
};

export default withWQ(AutoFormBase, {
    defaults: AutoFormBaseDefaults,
    fallback: AutoFormBaseFallback,
});
