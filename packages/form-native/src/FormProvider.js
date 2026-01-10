import { Fragment } from "react";
import { withWQ } from "@wq/react";
import {
    AutoFormBase as AutoForm,
    AutoInput,
    Form,
    CancelButton,
} from "@wq/form-common";
import * as components from "./components/index.js";

const FormProviderDefaults = {
    components: { ...components, AutoForm, AutoInput, Form, CancelButton },
};

export default withWQ(Fragment, {
    name: "FormProvider",
    defaults: FormProviderDefaults,
});
