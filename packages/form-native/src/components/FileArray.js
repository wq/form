import React from "react";
import { withWQ } from "@wq/react";
import { List } from "react-native-paper";
import FieldsetArray from "./FieldsetArray.js";

function FileArray(props) {
    return (
        <>
            {props.label && <List.Subheader>{props.label}</List.Subheader>}
            <FieldsetArray {...props} />
        </>
    );
}

export default withWQ(FileArray);
