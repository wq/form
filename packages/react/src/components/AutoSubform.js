import React from 'react';
import { useComponents } from '../hooks';
import PropTypes from 'prop-types';

export default function AutoSubform({ name, label, subform }) {
    const { Fieldset, AutoInput } = useComponents();

    return (
        <Fieldset label={label}>
            {subform.map(({ name: fieldName, ...rest }) => (
                <AutoInput
                    key={fieldName}
                    name={`${name}.${fieldName}`}
                    {...rest}
                />
            ))}
        </Fieldset>
    );
}

AutoSubform.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    subform: PropTypes.arrayOf(PropTypes.object)
};
