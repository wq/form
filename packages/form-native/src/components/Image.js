import React from "react";
import { withWQ } from "@wq/react";
import File from "./File.js";

function Image(props) {
    return <File accept="image/*" {...props} />;
}

export default withWQ(Image);
