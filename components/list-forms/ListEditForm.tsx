import React, { useState } from 'react';
import { Button, Group, MultiSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { listNameValidation } from '../../lib/validations';
import fetchJson from '../../lib/fetchJson';
import { useSWRConfig } from 'swr';
import { Loader } from '../utility/Loader';
import { ListsWithDetails } from '../ListList/ListList';
import { User } from '../../pages/api/auth/user';

interface ListEditFormProps {
    list: ListsWithDetails[0];
    onSubmit: () => void;
    showDelete?: boolean;
}

const userLabel = (user: { firstName: string, lastName: string, email: string }) => `${user.firstName} ${user.lastName} (${user.email})`;

export const ListEditForm = ({ list, onSubmit, showDelete }: ListEditFormProps) => {
    const { mutate } = useSWRConfig();

    const form = useForm({
        initialValues: {
            name: list.name,
            accessUsers: list.accessUsers.map(u => u.email)
        },
        validationRules: {
            name: listNameValidation,
            accessUsers: (emails: string[]) => emails.every(email => selectData.some(entry => entry.value === email))
        },
        errorMessages: {
            name: 'List name should include at least 3 and at most 20 characters',
            accessUsers: 'All entries should exist'
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
        onSubmit();
    };

    const [selectData, setSelectData] = useState(() => list.accessUsers.map(u => ({
        value: u.email,
        label: userLabel(u)
    })));

    const handleCreateUser = async (email: string) => {
        try {
            const result = await fetchJson(`/api/data/users/check?email=${email}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }) as User;
            setSelectData(data => [...data, {
                value: result.email,
                label: userLabel(result)
            }]);
        } catch (e) {

        }
    };

    const userSelect = <MultiSelect
        error={form.errors.accessUsers}
        mt="sm"
        label="Users with access to this list"
        placeholder="Select emails"
        value={form.values.accessUsers}
        data={selectData}
        searchable
        creatable
        getCreateLabel={query => `Add user with ${query} email`}
        onChange={v => form.setFieldValue('accessUsers', v)}
        onCreate={handleCreateUser}
    />;

    return (
        <Loader action={handleSubmit}>
            {(apply, loading) =>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput label="List name"
                               {...form.getInputProps('name')}
                    />
                    {userSelect}
                    <Group mt="xl" position="apart" align="flex-end">
                        {showDelete && <Loader action={handleDelete}>
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
                        </Loader>}
                        <Button
                            color="blue"
                            type="submit"
                            loading={loading}
                        >
                            Apply
                        </Button>
                    </Group>
                </form>}
        </Loader>
    );
};