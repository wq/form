import React from "react";
import { AutoFormBase } from "@wq/form-common";
import FormProvider from "./FormProvider.js";

export default function AutoForm(props) {
    return (
        <FormProvider>
            <AutoFormBase {...props} />
        </FormProvider>
    );
}
