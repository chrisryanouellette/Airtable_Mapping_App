import { Box, Button, Text } from '@airtable/blocks/ui'
import React from 'react'
import { Mappings } from '../types'
import { Container } from './styled'

interface OutputMappingsProps {
	step: number
	mappings: Mappings
	previousStep(): void
}

export function OutputMappings(props: OutputMappingsProps) {
	if (props.step !== 4) return null
	return (
		<React.Fragment>
			<Text size='large'>
				Copy the mappings below into your App or automation.
			</Text>
			<Container>
				<textarea
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
				<Button marginLeft='auto' onClick={() => {}}>
					Copy
				</Button>
			</Box>
		</React.Fragment>
	)
}
