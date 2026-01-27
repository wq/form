import * as formCommon from "@wq/form-common";
import * as formWeb from "@wq/form-web";
import fs from "fs";

const index = [];
index.push("export {");
for (const key in formCommon) {
    index.push(`    ${key},`);
}
index.push('} from "@wq/form-common";');
index.push("");

index.push("export {");
for (const key in formWeb) {
    index.push(`    ${key},`);
}
index.push('} from "@wq/form-web";');

const src = index.join("\n") + "\n";

console.log("src/index.js");
fs.writeFileSync("src/index.js", src);

console.log("src/index.native.js");
fs.writeFileSync(
    "src/index.native.js",
    src.replace(/@wq\/form-web/g, "@wq/form-native"),
);
