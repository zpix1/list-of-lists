import React from 'react';
import useSWR from 'swr';
import { useForm } from '@mantine/hooks';
import fetchJson from '../../lib/fetchJson';
import { listNameValidation } from '../../lib/validations';
import { Badge, Button, ColorSwatch, Group, InputWrapper, TextInput, useMantineTheme } from '@mantine/core';
import { CheckIcon } from '@modulz/radix-icons';
import { Loader } from '../utility/Loader';
import { Tags } from './TaskItemEditForm';
import { X } from 'tabler-icons-react';

export const ManageTagsForm = () => {
    const { data, mutate } = useSWR<Tags>('/api/data/tags');

    const handleCreateTag = async () => {
        try {
            await fetchJson('/api/data/tags', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form.values)
            });
            await mutate();
        } catch (e) {
            console.error(e);
        } finally {
            form.setFieldValue('value', '');
        }
    };

    const handleRemoveTag = async (id: number) => {
        try {
            await fetchJson('/api/data/tags', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id
                })
            });
            await mutate();
        } catch (e) {
            console.error(e);
        }
    };


    const form = useForm({
        initialValues: {
            value: '',
            color: 'blue'
        },
        validationRules: {
            value: (v) => listNameValidation(v) && !data?.some(t => t.value === v)
        },
        errorMessages: {
            value: 'Tag name should be unique, include at least 3 and at most 20 characters'
        }
    });

    const theme = useMantineTheme();
    const swatches = Object.keys(theme.colors).map((color) => {
        const hex = theme.colors[color][6];
        return (
            <ColorSwatch
                key={hex}
                color={hex}
                onClick={() => form.setFieldValue('color', color)}
            >
                {form.values.color === color && <CheckIcon />}
            </ColorSwatch>
        );
    });

    return (
        <>
            <Group>
                {data?.map(t => <Badge p="xs" key={`${t.value}`} color={t.color}>
                    <Group position="left">
                        {t.value}
                        <X size={16} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t.id)} />
                    </Group>
                </Badge>)}
            </Group>
            <Loader action={handleCreateTag}>
                {
                    (apply, loading) =>
                        <form onSubmit={form.onSubmit(apply)}>
                            <TextInput
                                mt="md"
                                label="New tag name"
                                placeholder="some tag"
                                {...form.getInputProps('value')}
                            />
                            <InputWrapper label="Color" mt="xs">
                                <Group position="center" spacing="xs">
                                    {swatches}
                                </Group>
                            </InputWrapper>
                            <Group mt="xl" position="right" align="flex-end">
                                <Button
                                    color="blue"
                                    type="submit"
                                    loading={loading}
                                >
                                    Create
                                </Button>
                            </Group>
                        </form>
                }
            </Loader>
        </>
    );

};