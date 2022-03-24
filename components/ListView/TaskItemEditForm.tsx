import React, { useMemo, useState } from 'react';
import { Prisma } from '@prisma/client';
import { Button, Checkbox, Group, Modal, MultiSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { taskDescriptionValidation } from '../../lib/validations';
import fetchJson from '../../lib/fetchJson';
import useSWR, { useSWRConfig } from 'swr';
import { Loader } from '../utility/Loader';
import { DatePicker, TimeInput } from '@mantine/dates';
import { ListWithTasks } from './ListView';
import { getTags } from '../../pages/api/data/tags';
import { ManageTagsForm } from './ManageTagsForm';

export type Tags = Prisma.PromiseReturnType<typeof getTags>;

interface TaskItemEditFormProps {
    task: ListWithTasks['tasks'][0];
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
            listId: task.listId,
            tags: task.tags.map(t => `${t.id}`)
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

    const [isNewTagDialogShown, setIsNewTagDialogShown] = useState(false);

    const { data: tags, error, mutate: mutateTags } = useSWR<Tags>('/api/data/tags');

    const dataTags = useMemo(() =>
            tags?.map(
                ({ value, id, color }) =>
                    ({
                        value: `${id}`,
                        label: value,
                        color: color
                    })
            ),
        [tags]
    );

    const handleCreateTag = async (tagValue: string) => {
        try {
            await fetchJson('/api/data/tags', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    value: tagValue
                })
            });
            await mutateTags();
        } catch (e) {
            console.error(e);
        }
    };

    const tagsSelect = <MultiSelect
        error={error ?? form.errors.tags}
        mt="sm"
        label="Tags"
        placeholder="Select tags"
        disabled={!tags}
        value={form.values.tags}
        data={dataTags ?? []}
        searchable
        getCreateLabel={query => `Add new tag with value of ${query}`}
        onChange={v => form.setFieldValue('tags', v)}
        onCreate={handleCreateTag}
    />;

    return (
        <>
            <Modal
                opened={isNewTagDialogShown}
                onClose={() => setIsNewTagDialogShown(false)}
                title="Manage tags"
            >
                <ManageTagsForm
                    onSubmit={() => setIsNewTagDialogShown(false)}
                />
            </Modal>
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
                        {tagsSelect}
                        <Group mt="xs" position="apart" align="center"
                               style={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                                label="Done?"
                                checked={form.values.isDone}
                                onChange={e => form.setFieldValue('isDone', e.target.checked)}
                            />
                            <Button
                                onClick={() => setIsNewTagDialogShown(true)}
                                variant="outline"
                            >
                                Manage tags
                            </Button>
                        </Group>
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

        </>
    );
};