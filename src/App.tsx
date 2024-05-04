import { Link } from 'react-router-dom';

function App() {
	return (
		<div>
			<Link to={`/exchanges?code=KRW-BTC`}>거래소</Link>
		</div>
	);
}

export default App;
