import React from 'react'

interface TextAreaProps {
	ref?: React.MutableRefObject<HTMLTextAreaElement>
	value: string | number
}

export const TextArea = React.forwardRef(
	(
		props: TextAreaProps,
		ref: React.MutableRefObject<HTMLTextAreaElement>
	) => {
		const styles: React.CSSProperties = {
			minHeight: '200px',
			width: '100%',
		}
		return (
			<textarea style={styles} value={props.value} ref={ref} readOnly />
		)
	}
)
