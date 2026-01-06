import React from "react";
import { useComponents, withWQ, createFallbackComponent } from "@wq/react";
import { Formik, Form as FormRoot } from "formik";
import { useValidate } from "../hooks.js";
import PropTypes from "prop-types";

const submitForm = createFallbackComponent("useSubmitForm", "@wq/outbox");
const FormFallback = {
    components: {
        FormRoot,
        useValidate,
        useSubmitForm() {
            return submitForm;
        },
    },
};

function Form({
    action,
    method,
    onSubmit,
    storage,
    backgroundSync,
    outboxId,
    preserve,
    modelConf,
    postSaveNav,
    data = {},
    csrftoken,
    error,
    children,
}) {
    const { FormRoot, useValidate, useSubmitForm } = useComponents(),
        validate = useValidate(),
        submitForm = useSubmitForm();

    if (backgroundSync === undefined) {
        backgroundSync = false;
    }

    async function handleSubmit(
        values,
        { setSubmitting, setTouched, setErrors },
    ) {
        if (onSubmit) {
            const result = await onSubmit(values);
            if (!result) {
                setSubmitting(false);
                return;
            }
        }

        const has_files = checkForFiles(values);

        const [item, error] = await submitForm({
            url: action,
            storage,
            backgroundSync,
            has_files,
            outboxId,
            preserve,
            data: {
                _method: method,
                ...values,
            },
            csrftoken,
            config: modelConf,
            postSaveNav,
        });

        if (error) {
            const errors = parseApiError(item.error, values);
            setErrors(errors);
            setTouched(errors, false);
        }

        setSubmitting(false);

        return item;
    }

    const errors = parseApiError(error, data);

    return (
        <Formik
            initialValues={data}
            initialErrors={errors}
            initialTouched={errors}
            validate={(values) => validate(values, modelConf)}
            validateOnMount={
                validate.onMount !== undefined ? validate.onMount : false
            }
            validateOnBlur={
                validate.onBlur !== undefined ? validate.onBlur : true
            }
            validateOnChange={
                validate.onChange !== undefined ? validate.onChange : false
            }
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            <FormRoot>{children}</FormRoot>
        </Formik>
    );
}

Form.propTypes = {
    action: PropTypes.string,
    method: PropTypes.string,
    onSubmit: PropTypes.func,
    storage: PropTypes.string,
    backgroundSync: PropTypes.bool,
    outboxId: PropTypes.number,
    preserve: PropTypes.arrayOf(PropTypes.string),
    modelConf: PropTypes.object,
    postSaveNav: PropTypes.func,
    data: PropTypes.object,
    csrftoken: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    FormRoot: PropTypes.func,
    children: PropTypes.node,
};

export default withWQ(Form, { fallback: FormFallback });

function parseApiError(error, values) {
    if (!error) {
        return;
    }
    const errors = {};
    if (typeof error === "string") {
        errors["__other__"] = error;
    } else {
        Object.entries(error).map(([key, error]) => {
            if (!(key in values)) {
                key = "__other__";
            }
            if (Array.isArray(error)) {
                if (typeof error[0] === "object") {
                    errors[key] = error.map((err, i) =>
                        parseApiError(err, (values[key] || [])[i] || {}),
                    );
                    return;
                }
            } else if (typeof error === "object") {
                errors[key] = parseApiError(error, values[key] || {});
                return;
            } else {
                error = [error];
            }
            if (errors[key]) {
                error = [errors[key], ...error];
            }
            errors[key] = error.join("; ");
        });
    }
    return errors;
}

function checkForFiles(values) {
    if (!values || typeof values !== "object") {
        return false;
    }
    if (values.name && values.type && (values.body || values.uri)) {
        return true;
    }
    if (Array.isArray(values)) {
        return values.some(checkForFiles);
    }
    return Object.values(values).some(checkForFiles);
}
