import React from "react";
import { useField } from "formik";
import { useComponents, withWQ, createFallbackComponent } from "@wq/react";
import AutoInput from "./AutoInput.js";
import Form from "./Form.js";
import CancelButton from "./CancelButton.js";
import { initFormData } from "../hooks.js";
import PropTypes from "prop-types";
import { validate as defaultValidate } from "../hooks.js";

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
                "AutoForm",
            ),
            View: createFallbackComponent("View", "@wq/material"),
            HorizontalView: createFallbackComponent(
                "HorizontalView",
                "@wq/material",
            ),
        },
    };

function AutoFormBase({
    form = [],
    action,
    method,
    validate = defaultValidate,
    onSubmit,
    submitOptions,
    data,
    error,
    children,
    cancel,
    hideSubmit,
    ...rest
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

    if (hideSubmit && !onSubmit) {
        onSubmit = () => null;
    }

    return (
        <Form
            action={action}
            method={method}
            validate={(data) => validate(data, form)}
            onSubmit={onSubmit}
            submitOptions={submitOptions}
            data={formData}
            error={error}
            {...rest}
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
    form: PropTypes.arrayOf(PropTypes.object),
    action: PropTypes.string,
    method: PropTypes.string,
    validate: PropTypes.func,
    onSubmit: PropTypes.func,
    submitOptions: PropTypes.object,
    data: PropTypes.object,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    children: PropTypes.node,
    cancel: PropTypes.object,
    hideSubmit: PropTypes.bool,
};

export default withWQ(AutoFormBase, {
    defaults: AutoFormBaseDefaults,
    fallback: AutoFormBaseFallback,
});
