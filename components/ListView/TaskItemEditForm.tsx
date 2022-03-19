import React from 'react';
import { Task } from '@prisma/client';
import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { taskDescriptionValidation } from '../../lib/validations';
import fetchJson from '../../lib/fetchJson';
import { useSWRConfig } from 'swr';
import { Loader } from '../utility/Loader';

interface TaskItemEditFormProps {
    task: Task;
    onSubmit: () => void;
}

export const TaskItemEditForm = ({ task, onSubmit }: TaskItemEditFormProps) => {
    const { mutate } = useSWRConfig();

    const form = useForm({
        initialValues: {
            shortDesc: task.shortDesc,
            isDone: task.isDone,
            dueTo: task.dueTo,
            listId: task.listId
        },
        validationRules: {
            shortDesc: taskDescriptionValidation
        },
        errorMessages: {
            shortDesc: 'Task description should have at least 3 and at most 100 characters'
        }
    });

    const handleDelete = async () => {
        await fetchJson(`/api/data/tasks/${task.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        await mutate(`/api/data/lists/${task.listId}`);
        onSubmit();
    }

    const handleSubmit = async () => {
        await fetchJson(`/api/data/tasks/${task.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                form.values
            )
        });
        await mutate(`/api/data/lists/${task.listId}`);
        onSubmit();
    };

    return (
        <Loader action={handleSubmit}>
            {(apply, loading) =>
                <form onSubmit={form.onSubmit(apply)}>
                    <TextInput label="Task description"
                               {...form.getInputProps('shortDesc')}
                    />
                    <Checkbox mt="md"
                              label="Done?"
                              checked={form.values.isDone}
                              onChange={e => form.setFieldValue('isDone', e.target.checked)}
                    />
                    <Group mt="xl" position="apart" align="flex-end">
                        <Loader action={handleDelete}>
                            {(apply, loading) => {
                                return <Button
                                    color="red"
                                    type="submit"
                                    loading={loading}
                                    onClick={() => apply()}
                                >
                                    Delete
                                </Button>;
                            }}
                        </Loader>
                        <Button
                            color="blue"
                            type="submit"
                            loading={loading}
                        >
                            Apply
                        </Button>
                    </Group>
                </form>
            }
        </Loader>
    );
};