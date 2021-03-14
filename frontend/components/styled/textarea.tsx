import React from 'react'

interface TextAreaProps {
	value: string | number
	ref?: React.MutableRefObject<HTMLTextAreaElement>
	onChange?(e: React.ChangeEvent<HTMLTextAreaElement>)
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
			<textarea
				style={styles}
				value={props.value}
				ref={ref}
				onChange={props?.onChange}
				readOnly={!props.onChange}
			/>
		)
	}
)
