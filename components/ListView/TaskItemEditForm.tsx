import React from 'react';
import { Task } from '@prisma/client';
import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { taskDescriptionValidation } from '../../lib/validations';
import fetchJson from '../../lib/fetchJson';
import { useSWRConfig } from 'swr';
import { Loader } from '../utility/Loader';
import { DatePicker, TimeInput } from '@mantine/dates';

interface TaskItemEditFormProps {
    task: Task;
    onSubmit: () => void;
}

export const TaskItemEditForm = ({ task, onSubmit }: TaskItemEditFormProps) => {
    const { mutate } = useSWRConfig();
    task.dueTo = task.dueTo && new Date(task.dueTo as unknown as string);

    const form = useForm({
        initialValues: {
            shortDesc: task.shortDesc,
            isDone: task.isDone,
            dueToTime: task.dueTo,
            dueToDate: task.dueTo,
            listId: task.listId
        },
        validationRules: {
            shortDesc: taskDescriptionValidation
        },
        errorMessages: {
            shortDesc: 'Task description should have at least 3 and at most 60 characters'
        }
    });

    const handleDelete = async () => {
        await fetchJson(`/api/data/tasks/${task.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        await mutate(`/api/data/lists/${task.listId}`);
        onSubmit();
    };

    const handleSubmit = async () => {
        const { dueToDate, dueToTime, ...values } = form.values;

        const date = (() => {
            if (dueToDate && dueToTime) {
                dueToDate.setSeconds(dueToTime.getSeconds());
                dueToDate.setMinutes(dueToTime.getMinutes());
                dueToDate.setHours(dueToTime.getHours());
                return dueToDate;
            }
            return dueToDate;
        })();

        await fetchJson(`/api/data/tasks/${task.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    ...values,
                    dueTo: date
                }
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
                    <Group mt="xs" grow>
                        <DatePicker label="Due to date"
                                    {...form.getInputProps('dueToDate')}
                        />
                        <TimeInput label="Due to time"
                                   {...form.getInputProps('dueToTime')}
                        />
                    </Group>
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