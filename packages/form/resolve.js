import { register } from "node:module";

register("./resolve.js", import.meta.url);

export function resolve(specifier, context, nextResolve) {
    if (specifier.endsWith(".js")) {
        return nextResolve(specifier, context);
    }
    if (
        context?.parentURL?.match(/mui2-file-dropzone\/dist\//) &&
        specifier.startsWith(".")
    ) {
        if (specifier.endsWith("types")) {
            specifier += "/index.js";
        } else {
            specifier += ".js";
        }
    }
    if (specifier.match("@mui/material")) {
        specifier += "/index.js";
    }
    if (specifier.match("@mui/utils") || specifier.match("@mui/system")) {
        specifier = specifier.replace(
            /@mui\/([^/]+)\/(.+)$/,
            "@mui/$1/esm/$2/index.js",
        );
    }
    if (specifier.endsWith("@mui/styled-engine")) {
        specifier += "/index.js";
    }
    return nextResolve(specifier, context);
}
