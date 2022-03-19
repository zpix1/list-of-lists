import React, { useState } from 'react';
import { useForm } from '@mantine/hooks';
import { EnvelopeClosedIcon, LockClosedIcon } from '@modulz/radix-icons';
import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    LoadingOverlay,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import Layout from 'components/Layout';
import useUser from 'lib/useUser';
import { useRouter } from 'next/router';
import fetchJson, { FetchError } from 'lib/fetchJson';

export interface AuthenticationFormProps {
    noShadow?: boolean;
    noPadding?: boolean;
    noSubmit?: boolean;
    style?: React.CSSProperties;
}

export default function AuthenticationForm({
                                               noShadow,
                                               noPadding,
                                               noSubmit,
                                               style,
                                           }: AuthenticationFormProps) {
    const { user, mutateUser } = useUser();
    const router = useRouter();
    if (user?.isLoggedIn) {
        router.push('/');
    }
    const [formType, setFormType] = useState<'register' | 'login'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleFormType = () => {
        setFormType((current) => (current === 'register' ? 'login' : 'register'));
        setError(null);
    };

    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsOfService: false,
        },

        validationRules: {
            firstName: (value) => formType === 'login' || value.trim().length >= 2,
            lastName: (value) => formType === 'login' || value.trim().length >= 2,
            email: (value) => /^\S+@\S+$/.test(value),
            password: (value) => /^.{6,}$/.test(value),
            confirmPassword: (val, values) => formType === 'login' || val === values?.password,
        },

        errorMessages: {
            email: 'Invalid email',
            password: 'Password should contain at least 6 characters',
            confirmPassword: 'Passwords don\'t match. Try again',
        },
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await mutateUser(
                await fetchJson(`/api/auth/${formType}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        form.values
                    )
                })
            );
            setError(null);
        } catch (error) {
            if (error instanceof FetchError) {
                setError(error.data.message);
            } else {
                console.error('An unexpected error happened:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Container size="xs">
                <Paper p="md">
                    <Title order={2}
                           style={{ paddingBottom: 10 }}>{formType === 'register' ? 'Create a new account' : 'Log in'}</Title>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <LoadingOverlay visible={loading} />
                        {formType === 'register' && (
                            <Group grow>
                                <TextInput
                                    data-autofocus
                                    required
                                    placeholder="Your first name"
                                    label="First name"
                                    {...form.getInputProps('firstName')}
                                />

                                <TextInput
                                    required
                                    placeholder="Your last name"
                                    label="Last name"
                                    {...form.getInputProps('lastName')}
                                />
                            </Group>
                        )}

                        <TextInput
                            mt="md"
                            required
                            placeholder="Your email"
                            label="Email"
                            icon={<EnvelopeClosedIcon />}
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            mt="md"
                            required
                            placeholder="Password"
                            label="Password"
                            icon={<LockClosedIcon />}
                            {...form.getInputProps('password')}
                        />

                        {formType === 'register' && (
                            <PasswordInput
                                mt="md"
                                required
                                label="Confirm Password"
                                placeholder="Confirm password"
                                icon={<LockClosedIcon />}
                                {...form.getInputProps('confirmPassword')}
                            />
                        )}

                        {formType === 'register' && (
                            <Checkbox
                                mt="xl"
                                label="I agree"
                                {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                            />
                        )}

                        {error && (
                            <Text color="red" size="sm" mt="sm">
                                {error}
                            </Text>
                        )}

                        {!noSubmit && (
                            <Group position="apart" mt="xl">
                                <Anchor
                                    component="button"
                                    type="button"
                                    color="gray"
                                    onClick={toggleFormType}
                                    size="sm"
                                >
                                    {formType === 'register'
                                        ? 'Have an account? Login'
                                        : 'Don\'t have an account? Register'}
                                </Anchor>

                                <Button color="blue" type="submit">
                                    {formType === 'register' ? 'Register' : 'Login'}
                                </Button>
                            </Group>
                        )}
                    </form>
                </Paper>
            </Container>
        </Layout>
    );
}