import React from "react";
import { useComponents, withWQ, createFallbackComponents } from "@wq/react";
import PropTypes from "prop-types";

const FieldsetArrayFallback = {
    components: createFallbackComponents(["View", "Button"], "@wq/material"),
};

function FieldsetArray({ label, children, addRow }) {
    const { View, Button } = useComponents();
    return (
        <View>
            {children}
            {addRow && (
                <Button onClick={() => addRow()}>{`Add ${label}`}</Button>
            )}
        </View>
    );
}

FieldsetArray.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
    addRow: PropTypes.func,
};

export default withWQ(FieldsetArray, { fallback: FieldsetArrayFallback });
