import { TableMapping } from '../types'
import React, { useState } from 'react'
import { Box, Button, Text } from '@airtable/blocks/ui'
import { Base } from '@airtable/blocks/models'
import { Card, Container } from './styled'

interface SelectBaseProps {
	step: number
	base: Base
	tableMappings: TableMapping
}

export function SelectTables(props: SelectBaseProps) {
	const [selectedTables, setselectedTables] = useState<string[]>([])
	const [warning, setwarning] = useState<string>('')

	function handleSelectTable(id: string): void {
		const tables = [...selectedTables]
		if (tables.includes(id)) {
			tables.splice(tables.indexOf(id), 1)
		} else {
			tables.push(id)
		}
		setselectedTables(tables)
	}

	function handleAdvanceStep(): void {
		if (!selectedTables.length) {
			return setwarning(`Please select at least one table.`)
		}
	}

	if (props.step !== 0) return null
	return (
		<React.Fragment>
			<Text size='large'>
				Begin by selecting all the tables that will be used by the App
				or Automation.
			</Text>
			<Container
				display='flex'
				flexWrap='wrap'
				justifyContent='space-between'
				margin='1% 0'
			>
				{props.base.tables.map((table) => {
					const isSelected = selectedTables.includes(table.id)
					return (
						<Card key={table.id} flow='column'>
							<Text size='large'>{table.name}</Text>
							{table.description ? (
								<Text overflow='auto' height='inherit'>
									{table.description}
								</Text>
							) : null}
							<Container marginTop='7px'>
								<Button
									width='100%'
									variant={isSelected ? 'primary' : 'default'}
									onClick={() => handleSelectTable(table.id)}
								>
									{isSelected ? 'Remove' : 'Add'}
								</Button>
							</Container>
						</Card>
					)
				})}
			</Container>
			<Box display='flex' marginTop='auto' alignItems='center'>
				{warning ? <Text size='xlarge'>{warning}</Text> : null}
				<Button marginLeft='auto' onClick={handleAdvanceStep}>
					Next Step
				</Button>
			</Box>
		</React.Fragment>
	)
}
