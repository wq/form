const HTML5_INPUT_TYPES = {
    // Map XForm field types to <input type>
    barcode: false,
    file: "file",
    binary: "file", // wq.db <1.3
    date: "date",
    dateTime: "datetime-local",
    decimal: "number",
    geopoint: false,
    geoshape: false,
    geotrace: false,
    int: "number",
    select: false,
    select1: false,
    string: "text",
    time: "time",

    // String subtypes
    password: "password",
    email: "email",
    phone: "tel",
    text: false,
    note: false,
};

export function useHtmlInput({ name, type, ["wq:length"]: length }) {
    return {
        name,
        type: HTML5_INPUT_TYPES[type] || "text",
        maxLength: length && +length,
    };
}

export function initFormData(form, data) {
    if (!data) {
        data = {};
    }

    const formData = {};

    if (data.id) {
        formData.id = data.id;
    }

    form.forEach((field) => {
        let fieldName = field.name;
        if (field["wq:ForeignKey"]) {
            const naturalKey = field.name.match(/^([^\]]+)\[([^\]]+)\]$/);
            if (
                naturalKey &&
                data[naturalKey[1]] &&
                data[naturalKey[1]][naturalKey[2]]
            ) {
                fieldName = naturalKey[1];
            } else {
                fieldName = `${field.name}_id`;
            }
        }

        let value;
        if (field.type === "repeat") {
            value = (data[fieldName] || []).map((row) =>
                initFormData(field.children, row),
            );
        } else if (field.type === "group") {
            if (fieldName) {
                value = initFormData(field.children, data[fieldName] || {});
            } else {
                value = initFormData(field.children, data);
            }
        } else if (fieldName in data) {
            value = data[fieldName];
        } else {
            value = defaultValue(field);
        }

        if (fieldName) {
            formData[fieldName] = value;
        } else {
            Object.assign(formData, value);
        }
    });

    return formData;

    function defaultValue(field) {
        if (field.type === "select") {
            return [];
        } else if (NULL_FIELDS.includes(field.type)) {
            return null;
        } else {
            return "";
        }
    }
}

const NULL_FIELDS = ["date", "time", "dateTime", "int", "integer", "decimal"];

export function validate(values, form) {
    const labels = [],
        errors = validateRequired(values, form, labels);

    if (errors && labels.length) {
        errors["__other__"] =
            "The following fields are required: " +
            labels.filter((label, i) => labels.indexOf(label) === i).join(", ");
    }

    return errors || {};
}

function validateRequired(values, form, labels = null) {
    if (!values || !form) {
        return null;
    }

    const errors = {};

    form.forEach((field) => {
        let name, value, error;
        if (field["wq:ForeignKey"]) {
            const naturalKey = field.name.match(/^([^\]]+)\[([^\]]+)\]$/);
            if (naturalKey) {
                name = naturalKey[1];
                value =
                    values[naturalKey[1]] &&
                    values[naturalKey[1]][naturalKey[2]];
                error = { [naturalKey[2]]: "This field is required." };
            } else {
                name = field.name + "_id";
                value = values[name];
                error = "This field is required.";
            }
        } else {
            name = field.name;
            value = values[name];
            error = "This field is required.";
        }
        if (isMissing(value, field)) {
            errors[name] = error;
            if (labels) {
                labels.push(field.label);
            }
        } else if (value && field.type === "repeat") {
            const nestedErrors = value.map((row) =>
                validateRequired(row, field.children, labels),
            );
            if (nestedErrors.some((row) => row)) {
                errors[name] = nestedErrors;
            }
        } else if (field.type === "group") {
            if (name === "") {
                Object.assign(
                    errors,
                    validateRequired(values, field.children, labels),
                );
            } else if (value) {
                const nestedErrors = validateRequired(
                    value,
                    field.children,
                    labels,
                );
                if (nestedErrors) {
                    errors[name] = nestedErrors;
                }
            }
        }
    });

    return Object.keys(errors).length > 0 ? errors : null;
}

function isMissing(value, field) {
    if (field.required || (field.bind && field.bind.required)) {
        return value === undefined || value === null || value === "";
    } else {
        return false;
    }
}
