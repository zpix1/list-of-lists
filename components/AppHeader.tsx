import Link from 'next/link';
import { Avatar, Header, Menu } from '@mantine/core';

import useUser from 'lib/useUser';
import { useRouter } from 'next/router';
import fetchJson from 'lib/fetchJson';
import { Url } from './Url';
import { ClipboardList, Logout } from 'tabler-icons-react';

export const AppHeader = () => {
    const { user, mutateUser } = useUser();
    const router = useRouter();

    return (
        <Header height={60} p={20}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'space-between',
                gap: 20
            }}>
                <ClipboardList cursor="pointer" onClick={() => router.push('/')} />
                <div style={{ display: 'flex', justifyItems: 'flex-start', flexGrow: 1 }}>
                    {user?.isLoggedIn && <>
                        <Link href="/">
                            <Url>
                                My lists
                            </Url>
                        </Link>
                    </>}
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                    <Menu control={
                        <Avatar color="cyan">{user?.firstName[0]}{user?.lastName[0]}</Avatar>
                    }>
                        <Menu.Label>{user.firstName} {user.lastName}</Menu.Label>
                        <Menu.Item icon={<Logout size={14} />}
                                   onClick={async (e) => {
                                       e.preventDefault();
                                       mutateUser(
                                           await fetchJson('/api/auth/logout', { method: 'POST' }),
                                           false
                                       );
                                       router.push('/login');
                                   }}
                        >Logout</Menu.Item>
                    </Menu>
                    {user?.isLoggedIn && <>

                    </>}
                </div>
            </div>
        </Header>
    );
};
