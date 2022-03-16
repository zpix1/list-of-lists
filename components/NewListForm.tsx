import React, { useState } from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { listNameValidation } from '../lib/validations';
import fetchJson from '../lib/fetchJson';
import { useSWRConfig } from 'swr';

interface NewListFormProps {
    onSubmit: () => void;
}

export const NewListForm = ({ onSubmit }: NewListFormProps) => {
    const { mutate } = useSWRConfig();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: ''
        },
        validationRules: {
            name: listNameValidation
        },
        errorMessages: {
            name: 'List name should include at least 3 and at most 20 characters'
        }
    });

    const handleSubmit = async () => {
        setLoading(true);
        await fetchJson(`/api/data/lists`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                form.values
            )
        });
        await mutate('/api/data/lists');
        setLoading(false);
        onSubmit();
    };

    return <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="List name"
                   {...form.getInputProps('name')}
        />
        <Group position="right" mt="xl">
            <Button
                color="blue"
                type="submit"
                loading={loading}
            >
                Submit
            </Button>
        </Group>
    </form>;
};