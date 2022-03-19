import Layout from 'components/Layout';
import { UserLists } from '../components/UserLists';
import { NotificationsProvider } from '@mantine/notifications';

export default function Home() {
    return (
        <Layout>
            <NotificationsProvider>
                <UserLists />
            </NotificationsProvider>
        </Layout>
    );
}