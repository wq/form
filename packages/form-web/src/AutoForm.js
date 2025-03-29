import React from "react";
import { withWQ } from "@wq/react";
import { AutoFormBase, AutoInput, Form, CancelButton } from "@wq/form-common";
import * as components from "./components/index.js";

const AutoFormDefaults = {
    components: { ...components, AutoForm, AutoInput, Form, CancelButton },
};

function AutoForm(props) {
    if (!props.action && !props.onSubmit && !props.form) {
        return props.children || null;
    }
    return <AutoFormBase {...props} />;
}

export default withWQ(AutoForm, { defaults: AutoFormDefaults });
