import React from "react";
import { withWQ } from "@wq/react";
import Input from "./Input.js";

function DateTime({ InputLabelProps: overrides, ...rest }) {
    const InputLabelProps = {
        shrink: true,
        ...overrides,
    };
    return <Input InputLabelProps={InputLabelProps} {...rest} />;
}

export default withWQ(DateTime);
