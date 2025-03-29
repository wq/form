import React, { Fragment } from "react";
import { useComponents, withWQ, createFallbackComponents } from "@wq/react";
import AutoSubform from "./AutoSubform.js";
import AutoSubformArray from "./AutoSubformArray.js";
import ForeignKey from "./ForeignKey.js";
import GeoInput from "./GeoInput.js";
import PropTypes from "prop-types";
import { pascalCase } from "pascal-case";

const AutoInputDefaults = {
        components: {
            AutoSubform,
            AutoSubformArray,
            ForeignKey,
            Geo: GeoInput,
            Geopoint: GeoInput,
            Geotrace: GeoInput,
            Geoshape: GeoInput,
        },
    },
    AutoInputFallback = {
        components: {
            Text: Fragment,
            ...createFallbackComponents(
                [
                    "Checkbox",
                    "DateTime",
                    "File",
                    "Hidden",
                    "Image",
                    "Input",
                    "Radio",
                    "Select",
                    "Toggle",
                ],
                "@wq/form",
                "AutoForm"
            ),
        },
    };

function AutoInput({ name, choices, type, bind = {}, ...rest }) {
    const inputs = useComponents(),
        { AutoSubform, AutoSubformArray, Text } = useComponents();

    if (type === "group") {
        return <AutoSubform name={name} {...rest} />;
    } else if (type === "repeat") {
        return <AutoSubformArray name={name} {...rest} />;
    }

    let inputType,
        required = bind.required;
    if (rest["wq:ForeignKey"]) {
        const naturalKey = name.match(/^([^\]]+)\[([^\]]+)\]$/);
        if (naturalKey) {
            name = naturalKey.slice(1).join(".");
        } else {
            name = `${name}_id`;
        }
        inputType = "foreign-key";
    } else if (type === "select1" || type === "select one") {
        if (!choices) {
            choices = [];
        }
        if (choices.length < 5) {
            inputType = "toggle";
        } else if (choices.length < 10) {
            inputType = "radio";
        } else {
            inputType = "select";
        }
    } else if (type === "text") {
        inputType = "input";
    } else if (inputs[type]) {
        inputType = type;
    } else {
        if (type === "picture" || type === "photo") {
            inputType = "image";
        } else if (type === "video" || type === "audio") {
            inputType = "file";
        } else {
            inputType = "input";
        }
    }

    if (rest.control && rest.control.appearance) {
        inputType = rest.control.appearance;
    }

    const Input = inputs[inputType];

    if (!Input) {
        return (
            <Text>
                Unknown input type &quot;{inputType}&quot;. Try registering via{" "}
                {`wq={{components: { ${pascalCase(inputType)} }}}.`}
            </Text>
        );
    }

    return (
        <Input
            name={name}
            choices={choices}
            type={type}
            required={required}
            {...rest}
        />
    );
}

AutoInput.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    bind: PropTypes.object,
    "wq:ForeignKey": PropTypes.string,
    choices: PropTypes.arrayOf(PropTypes.object),
};

export default withWQ(AutoInput, {
    defaults: AutoInputDefaults,
    fallback: AutoInputFallback,
});
