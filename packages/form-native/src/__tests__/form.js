import * as form from "@wq/form/src/index.native.js";

test("it loads", () => {
    for (const key in form) {
        expect(form).toHaveProperty(key, expect.anything());
    }
});
