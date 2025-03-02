import React from "react";
import { withWQ } from "@wq/react";
import { AutoFormBase } from "@wq/form-common";
import * as components from "./components/index.js";

const AutoFormDefaults = {
    components: { ...components },
};

function AutoForm(props) {
    return <AutoFormBase {...props} />;
}

export default withWQ(AutoForm, { defaults: AutoFormDefaults });
