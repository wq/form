import React from "react";
import { withWQ } from "@wq/react";
import PropTypes from "prop-types";

function FormContainer({ children }) {
    return (
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div
                style={{
                    width: "100%",
                    maxWidth: "70em",
                    padding: "1em",
                    boxSizing: "border-box",
                }}
            >
                {children}
            </div>
        </div>
    );
}

FormContainer.propTypes = {
    children: PropTypes.node,
};

export default withWQ(FormContainer);
