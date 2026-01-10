import { AutoForm, FormProvider } from "../index.js";

test("it loads", () => {
    expect(AutoForm.name).toBe("AutoForm");
    expect(FormProvider.displayName).toBe("FormProvider:wq");
});
