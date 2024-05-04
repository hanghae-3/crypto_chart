import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../components/Layout.tsx';

const Exchanges = () => {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<Layout />
		</QueryClientProvider>
	);
};

export default Exchanges;
