import React, { Fragment, useCallback } from "react";
import { useComponents, withWQ, createFallbackComponents } from "@wq/react";
import { FieldArray, getIn } from "formik";
import PropTypes from "prop-types";
import AutoSubform from "./AutoSubform.js";
import { initFormData } from "../hooks.js";
import { pascalCase } from "change-case";

const AutoSubformArrayFallback = {
    components: {
        AutoSubform,
        Text: Fragment,
        ...createFallbackComponents(
            ["FieldsetArray", "FileArray"],
            "@wq/form",
            "AutoForm",
        ),
    },
};

function AutoSubformArray({ name, label, subform, ...rest }) {
    const { AutoSubform, Text } = useComponents(),
        inputs = useComponents(),
        componentName = rest.control && rest.control.appearance;

    let FieldsetArray;
    if (componentName) {
        // Defined in XLSForm config
        FieldsetArray = inputs[componentName];
        if (!FieldsetArray) {
            // eslint-disable-next-line
            FieldsetArray = ({ children, ...rest }) => {
                const { FieldsetArray } = inputs,
                    pascalName = pascalCase(componentName);
                return (
                    <FieldsetArray {...rest}>
                        <Text>
                            Unknown fieldset array type &quot;{componentName}
                            &quot;. Try registering via{" "}
                            {`wq={{components: { ${pascalName} }}}.`}
                        </Text>
                        {children}
                    </FieldsetArray>
                );
            };
        }
    } else if (
        subform.length === 1 &&
        (subform[0].type === "file" || subform[0].type === "image")
    ) {
        // Special case for subforms containing only a single file field
        FieldsetArray = inputs.FileArray;
    } else {
        // Default (or global default override)
        FieldsetArray = inputs.FieldsetArray;
    }

    const SubformArray = useCallback(
        ({ form: formikContext, push, remove, pop }) => {
            const { values } = formikContext,
                list = getIn(values, name) || [];

            function addRow(vals) {
                const row = initFormData(subform, vals || {});
                push(row);
            }

            const removeRow = remove,
                removeLastRow = pop;

            return (
                <FieldsetArray
                    name={name}
                    label={label}
                    subform={subform}
                    addRow={addRow}
                    removeRow={removeRow}
                    removeLastRow={removeLastRow}
                    {...rest}
                >
                    {list.map((row, i) => (
                        <AutoSubform
                            key={i}
                            label={`${label} ${i + 1}`}
                            name={`${name}[${i}]`}
                            subform={subform}
                            component={FieldsetArray.Fieldset}
                        />
                    ))}
                </FieldsetArray>
            );
        },
        [name, label, subform, FieldsetArray, AutoSubform],
    );

    SubformArray.displayName = "SubformArray";

    return (
        <FieldArray
            name={name}
            component={SubformArray}
            label={label}
            subform={subform}
        />
    );
}

AutoSubformArray.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    subform: PropTypes.arrayOf(PropTypes.object),
};

export default withWQ(AutoSubformArray, { fallback: AutoSubformArrayFallback });
