import { Button, Group, TextInput } from '@mantine/core';
import React from 'react';
import { useSWRConfig } from 'swr';
import { useForm } from '@mantine/hooks';
import { taskDescriptionValidation } from '../../lib/validations';
import { Loader } from '../utility/Loader';
import fetchJson from '../../lib/fetchJson';

interface TaskAddFormProps {
    listId: number;
}

export const TaskAddForm = ({ listId }: TaskAddFormProps) => {
    const { mutate } = useSWRConfig();

    const form = useForm({
        initialValues: {
            shortDesc: ''
        },
        validationRules: {
            shortDesc: taskDescriptionValidation
        },
        errorMessages: {
            shortDesc: 'Task description should have at least 3 and at most 100 characters'
        }
    });

    const handleSubmit = async () => {
        await fetchJson(`/api/data/tasks`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form.values,
                listId: listId
            })
        });
        await mutate(`/api/data/lists/${listId}`);
        form.setFieldValue('shortDesc', '');
    };

    return (
        <Loader action={handleSubmit}>
            {(apply, loading) =>
                <form onSubmit={form.onSubmit(apply)}>
                    <Group grow>
                        <TextInput
                            placeholder="Sample task"
                            label="Add a new task"
                            {...form.getInputProps('shortDesc')}
                        />
                    </Group>
                    <Button
                        mt="md"
                        type="submit"
                        loading={loading}
                    >
                        Submit
                    </Button>
                </form>
            }
        </Loader>
    );
};