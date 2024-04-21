import useFetchMarketCode from '../useFetchMarketCode';
import { render, renderHook, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

const debugTest = false;

describe('useFetchMarketCode 훅은', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('Hooks 테스트', () => {
		it('fetch 성공 시 원하는 데이터를 가져올 수 있다.', async () => {
			const mockMarketCodes = [
				{
					market: 'KRW-BTC',
					korean_name: '비트코인',
					english_name: 'Bitcoin',
				},
			];

			vi.spyOn(global, 'fetch').mockResolvedValue({
				ok: true,
				text: () => Promise.resolve(JSON.stringify(mockMarketCodes)),
			} as Response);

			const { result } = renderHook(() => useFetchMarketCode({ debug: debugTest }));

			await vi.waitUntil(async () => {
				return result.current.isLoading === false;
			});
			expect(result.current.marketCodes).toEqual(mockMarketCodes);
		});

		it('fetch 실패 시, 데이터', async () => {
			vi.spyOn(global, 'fetch').mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			} as Response);

			const { result } = renderHook(() => useFetchMarketCode({ debug: debugTest }));
			// await vi.waitUntil
			waitFor(async () => {
				return result.current.isLoading === false;
			});

			expect(result.current.marketCodes).toEqual([]);
		});
	});

	describe('컴포넌트 테스트', () => {
		const FetchMarketCodeComponent = () => {
			const { isLoading, marketCodes } = useFetchMarketCode({ debug: debugTest });
			return (
				<div>
					{isLoading && <p>로딩 중 입니다.</p>}
					{!isLoading && marketCodes.length > 0 ? (
						marketCodes.map((code) => (
							<p key={code.market}>
								{code.market}-{code.korean_name}-{code.english_name}
							</p>
						))
					) : (
						<p>데이터가 없습니다.</p>
					)}
				</div>
			);
		};
		it('성공적으로 데이터를 가져오면 해당 데이터를 보여준다.', async () => {
			const mockMarketCodes = [
				{
					market: 'KRW-BTC',
					korean_name: '비트코인',
					english_name: 'Bitcoin',
				},
			];

			vi.spyOn(global, 'fetch').mockResolvedValue({
				ok: true,
				text: () => Promise.resolve(JSON.stringify(mockMarketCodes)),
			} as Response);

			render(<FetchMarketCodeComponent />);

			const loadingStatus = screen.getByText(/^로딩/i);
			expect(loadingStatus).toBeInTheDocument();

			await waitForElementToBeRemoved(() => screen.queryByText(/^로딩/i));
			const item = screen.getByText(/KRW-BTC-비트코인-Bitcoin/i);
			expect(item).toBeInTheDocument();
		});

		it('데이터를 가져오는데 실패하면 ', async () => {
			vi.spyOn(global, 'fetch').mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			} as Response);

			render(<FetchMarketCodeComponent />);

			const loadingStatus = screen.getByText(/^로딩/i);
			expect(loadingStatus).toBeInTheDocument();

			await waitForElementToBeRemoved(() => screen.queryByText(/^로딩/i));
			const item = screen.getByText(/데이터가 없습니다./i);
			expect(item).toBeInTheDocument();
		});
	});
});
