import { useRouter } from 'next/router';
import { ListView } from '../../components/ListView/ListView';
import Layout from '../../components/Layout';

export default function ListPage() {
    const router = useRouter();
    const id = Number(router.query.id) || null;

    return (
        <Layout>
            {id && <ListView id={id} />}
        </Layout>
    );
}