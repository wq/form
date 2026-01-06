import React, { Fragment } from "react";
import { useComponents, withWQ, createFallbackComponent } from "@wq/react";
import PropTypes from "prop-types";
import { pascalCase } from "change-case";

export const Fieldset = createFallbackComponent(
    "Fieldset",
    "@wq/form",
    "AutoForm",
);

const AutoSubformFallback = {
    components: {
        Text: Fragment,
        AutoInput: createFallbackComponent(
            "AutoInput",
            "@wq/form",
            "AutoForm or AutoFormBase",
        ),
        Fieldset,
    },
};

function AutoSubform({ name, label, subform, component, ...rest }) {
    const { AutoInput, Text } = useComponents(),
        inputs = useComponents(),
        componentName = rest.control && rest.control.appearance;

    let Fieldset;
    if (component) {
        // Passed in from parent AutoSubformArray
        Fieldset = component;
    } else if (componentName) {
        // Defined in XLSForm config
        Fieldset = inputs[componentName];
        if (!Fieldset) {
            // eslint-disable-next-line
            Fieldset = ({ children, ...rest }) => {
                const { Fieldset } = inputs,
                    pascalName = pascalCase(componentName);
                return (
                    <Fieldset {...rest}>
                        <Text>
                            Unknown fieldset type &quot;{componentName}&quot;.{" "}
                            Try registering via{" "}
                            {`wq={{components: { ${pascalName} }}}.`}
                        </Text>
                        {children}
                    </Fieldset>
                );
            };
        }
    } else {
        // Default (or global default override)
        Fieldset = inputs.Fieldset;
    }

    const prefix = name ? `${name}.` : "";

    return (
        <Fieldset name={name} label={label} {...rest}>
            {subform.map(({ name: fieldName, children: subform, ...rest }) => (
                <AutoInput
                    key={fieldName}
                    name={`${prefix}${fieldName}`}
                    subform={subform}
                    {...rest}
                />
            ))}
        </Fieldset>
    );
}

AutoSubform.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    subform: PropTypes.arrayOf(PropTypes.object),
    component: PropTypes.elementType,
};

export default withWQ(AutoSubform, { fallback: AutoSubformFallback });
