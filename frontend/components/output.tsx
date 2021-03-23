import { Box, Button, Text } from '@airtable/blocks/ui'
import React, { useRef } from 'react'
import { Mappings } from '../types'
import { Container } from './styled'
import TextArea from './styled/textarea'

interface OutputMappingsProps {
	step: number
	mappings: Mappings
	previousStep(): void
}

export function OutputMappings(props: OutputMappingsProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	function copy() {
		const json = textareaRef.current.value
		inputRef.current.value = json
		inputRef.current.select()
		inputRef.current.setSelectionRange(0, 99999)
		document.execCommand('copy')
	}

	if (props.step !== 4) return null
	return (
		<React.Fragment>
			<Text size='large'>
				Copy the mappings below into your App or automation.
			</Text>
			<Container>
				<TextArea
					ref={textareaRef}
					value={JSON.stringify(props.mappings, undefined, 4)}
				/>
			</Container>
			<Box
				display='flex'
				marginTop='auto'
				alignItems='center'
				paddingBottom='16px'
			>
				<Button onClick={props.previousStep}>Previous Step</Button>
				<Button marginLeft='auto' onClick={copy}>
					Copy
				</Button>
			</Box>
			<input
				className='hidden'
				style={{
					position: 'absolute',
					opacity: 0,
					top: -1000,
					left: -1000,
				}}
				ref={inputRef}
			></input>
		</React.Fragment>
	)
}
