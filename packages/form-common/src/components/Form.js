import React from "react";
import { useComponents, withWQ } from "@wq/react";
import { Formik, Form as FormRoot } from "formik";
import PropTypes from "prop-types";

const FormFallback = { components: { FormRoot } };

function Form({
    action,
    method,
    validate = () => null,
    onSubmit,
    submitOptions,
    data = {},
    error,
    children,
    ...rest
}) {
    const { FormRoot } = useComponents();

    async function handleSubmit(
        data,
        { setSubmitting, setTouched, setErrors },
    ) {
        const hasFiles = checkForFiles(data);
        let result;
        try {
            result = await onSubmit({
                action,
                method,
                data,
                hasFiles,
                submitOptions,
            });
        } catch (error) {
            if (!error.detail) {
                console.warn("Error in onSubmit", error);
            }
            const errors = parseApiError(
                error.detail || error.message || `Error: ${error}`,
                data,
            );
            setErrors(errors);
            setTouched(errors, false);
            result = { error };
        }
        setSubmitting(false);
        return result;
    }

    const errors = parseApiError(error, data);

    return (
        <Formik
            initialValues={data}
            initialErrors={errors}
            initialTouched={errors}
            validate={validate}
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
            {...rest}
        >
            <FormRoot>{children}</FormRoot>
        </Formik>
    );
}

Form.propTypes = {
    action: PropTypes.string,
    method: PropTypes.string,
    validate: PropTypes.func,
    onSubmit: PropTypes.func,
    submitOptions: PropTypes.object,
    data: PropTypes.object,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
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
