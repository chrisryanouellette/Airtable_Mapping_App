import React from 'react'

interface TextAreaProps {
	value: string | number
	ref?: React.MutableRefObject<HTMLTextAreaElement>
	onChange?(e: React.ChangeEvent<HTMLTextAreaElement>)
}

function TextArea(
	props: TextAreaProps,
	ref: React.MutableRefObject<HTMLTextAreaElement>
) {
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

export default React.forwardRef(TextArea)
