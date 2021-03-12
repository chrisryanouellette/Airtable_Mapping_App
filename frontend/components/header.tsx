import { Box, Heading, Text } from '@airtable/blocks/ui'
import React from 'react'

export function Header() {
	return (
		<header>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				width='100%'
			>
				<Heading size='large'>Mapping App</Heading>
				<Text>
					An app for creating Base, Table, View, and Field Mappings.
				</Text>
			</Box>
		</header>
	)
}
