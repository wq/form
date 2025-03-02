import React from "react";
import { useComponents, withWQ, createFallbackComponent } from "@wq/react";
import { useFormikContext, getIn } from "formik";

export function useChoices(modelName, group_by) {
    const { useModel, useUnsynced } = useComponents(),
        records = useModel(modelName) || [],
        unsyncedItems = useUnsynced(modelName) || [],
        getGroup = (record) => (group_by && record[group_by]) || null;

    return unsyncedItems
        .map((item) => ({
            name: "outbox-" + item.id,
            label: `* ${item.label}`,
            group: getGroup(item.data),
            data: item.data,
        }))
        .concat(
            records.map((record) => ({
                name: record.id,
                label: record.label,
                group: getGroup(record),
                data: record,
            }))
        );
}

export function useFilteredChoices(modelName, group_by, filterConf) {
    const { useChoices } = useComponents(),
        choices = useChoices(modelName, group_by),
        { values } = useFormikContext(),
        filter = {};

    Object.entries(filterConf).forEach(([key, value]) => {
        filter[key] = getIn(values, value);
    });
    return choices.filter((choice) =>
        Object.entries(filter).every(([key, value]) => {
            return choice.data[key] == value;
        })
    );
}

export function useSelectInput(component) {
    const inputs = useComponents(),
        { Select } = inputs;
    let Component;
    if (typeof component === "string") {
        Component = inputs[component];
        if (!Component) {
            Component = function UnknownInput(props) {
                return (
                    <Select
                        {...props}
                        hint={`Unknown input type "${component}"`}
                    />
                );
            };
        }
    } else if (component) {
        Component = component;
    } else {
        Component = Select;
    }
    return Component;
}

const ForeignKeyDefaults = {
        components: {
            useChoices,
            useFilteredChoices,
            useSelectInput,
        },
    },
    ForeignKeyFallback = {
        components: {
            useModel: createFallbackComponent("useModel", "@wq/model"),
            useUnsynced: createFallbackComponent("useUnsynced", "@wq/outbox"),
            Select: createFallbackComponent("Select", "@wq/form"),
        },
    };

function ForeignKey({ filter, ...rest }) {
    if (filter) {
        return <FilteredForeignKey filter={filter} {...rest} />;
    } else {
        return <UnfilteredForeignKey {...rest} />;
    }
}

export default withWQ(ForeignKey, {
    defaults: ForeignKeyDefaults,
    fallback: ForeignKeyFallback,
});

function FilteredForeignKey({
    ["wq:ForeignKey"]: modelName,
    group_by,
    filter,
    component,
    ...rest
}) {
    const { useFilteredChoices, useSelectInput } = useComponents(),
        choices = useFilteredChoices(modelName, group_by, filter),
        Select = useSelectInput(component);
    return <Select {...rest} choices={choices} />;
}

function UnfilteredForeignKey({
    ["wq:ForeignKey"]: modelName,
    group_by,
    component,
    ...rest
}) {
    const { useChoices, useSelectInput } = useComponents(),
        choices = useChoices(modelName, group_by),
        Select = useSelectInput(component);
    return <Select {...rest} choices={choices} />;
}
