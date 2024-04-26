import React, { type PropsWithChildren, type ReactElement, useCallback, useState } from 'react';

type Props = {
	onError: (error: Error) => void;
};
function ErrorBoundary({ children, onError }: PropsWithChildren<Props>) {
	const [hasError, setHasError] = useState(false);

	const errorBoundaryCallback = useCallback(
		(error: Error) => {
			setHasError(true);
			onError(error);
		},
		[onError],
	);

	if (hasError) {
		return null;
	}

	return (
		<>
			{React.Children.map(children, (child) => {
				return React.cloneElement(child as ReactElement, {
					onError: errorBoundaryCallback,
				});
			})}
		</>
	);
}
