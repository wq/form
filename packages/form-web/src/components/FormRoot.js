import React from "react";
import { withWQ } from "@wq/react";
import { Form } from "formik";
import PropTypes from "prop-types";

function FormRoot({ children }) {
    return (
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Form
                style={{
                    width: "100%",
                    maxWidth: "70em",
                    padding: "1em",
                    boxSizing: "border-box",
                }}
            >
                {children}
            </Form>
        </div>
    );
}

FormRoot.propTypes = {
    children: PropTypes.node,
};

export default withWQ(FormRoot);
