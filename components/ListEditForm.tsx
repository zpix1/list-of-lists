import React from 'react';
import { List } from '@prisma/client';
import { Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { listNameValidation } from '../lib/validations';
import fetchJson from '../lib/fetchJson';
import { useSWRConfig } from 'swr';
import { Loader } from './utility/Loader';
import { useNotifications } from '@mantine/notifications';

interface ListEditFormProps {
    list: List;
    onSubmit: () => void;
    showDelete?: boolean;
}

export const ListEditForm = ({ list, onSubmit, showDelete }: ListEditFormProps) => {
    const { mutate } = useSWRConfig();

    const notifications = useNotifications();

    const form = useForm({
        initialValues: {
            name: list.name
        },
        validationRules: {
            name: listNameValidation
        },
        errorMessages: {
            name: 'List name should include at least 3 and at most 20 characters'
        }
    });

    const handleSubmit = async () => {
        await fetchJson(`/api/data/lists/${list.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                form.values
            )
        });
        await mutate('/api/data/lists');
        onSubmit();
    };

    const handleDelete = async () => {
        await fetchJson(`/api/data/lists/${list.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        await mutate('/api/data/lists');
    };

    return <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="List name"
                   {...form.getInputProps('name')}
        />
        <Group mt="xl" position="apart" align="flex-end">
            {showDelete && <Loader action={handleDelete}>
                {(apply, loading, error) => {
                    if (error) {
                        notifications.showNotification({
                            title: 'error',
                            message: error.message,
                            color: 'red'
                        });
                    }
                    return <Button
                        color="red"
                        type="submit"
                        loading={loading}
                        onClick={() => apply()}
                    >
                        Delete
                    </Button>;
                }}
            </Loader>}
            <Loader action={handleSubmit}>
                {(apply, loading, error) => {
                    if (error) {
                        notifications.showNotification({
                            title: 'error',
                            message: error.message,
                            color: 'red'
                        });
                    }
                    return <Button
                        color="blue"
                        type="submit"
                        loading={loading}
                        onClick={() => apply()}
                    >
                        Rename
                    </Button>;
                }}
            </Loader>
        </Group>
    </form>;
};