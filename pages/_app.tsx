import { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import fetchJson from 'lib/fetchJson';
import { NotificationsProvider } from '@mantine/notifications';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <NotificationsProvider>
            <SWRConfig
                value={{
                    fetcher: fetchJson,
                    onError: (err) => {
                        console.error(err);
                    },
                }}
            >
                <Component {...pageProps} />
            </SWRConfig>
        </NotificationsProvider>
    );
}

export default MyApp;
