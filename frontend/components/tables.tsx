import { TableMapping } from '../types'
import { Box, Button, Text } from '@airtable/blocks/ui'
import { Base, Table } from '@airtable/blocks/models'
import { Card } from './styled/card'
import { Container } from './styled'
import { createRefName } from '../helpers'
import { UpdateMappings } from '../hooks/useMappings'
import React, { useEffect, useState } from 'react'

interface SelectTablesProps {
	step: number
	base: Base
	tableMappings: { [refName: string]: TableMapping }
	updateMappings: UpdateMappings
}

export function SelectTables(props: SelectTablesProps) {
	const [selectedTables, setselectedTables] = useState<string[]>([])
	const [warning, setwarning] = useState<string>('')

	useEffect(() => {
		if (props.step !== 0) return
		const selectedTables = Object.values(props.tableMappings).map(
			(mapping) => mapping.id
		)
		setselectedTables(selectedTables)
	}, [props.step])

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
			return setwarning(`Select at least one table.`)
		}
		const tableMappings: { [refName: string]: TableMapping } = {}
		selectedTables.forEach((id) => {
			const table = props.base.getTable(id)
			let refName = createRefName(table.name)
			if (tableMappings[refName]) {
				refName = refName + Math.floor(Math.random() * 100).toString()
			}
			tableMappings[refName] = {
				id,
				baseId: props.base.id,
				name: table.name,
				refName,
				views: {},
			}
		})
		props.updateMappings('tables', tableMappings)
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
				justifyContent='flex-start'
				margin='1% 0'
			>
				{props.base.tables.map((table) =>
					TableCard({
						table,
						isSelected: selectedTables.includes(table.id),
						handleSelectTable,
					})
				)}
			</Container>
			<Box
				display='flex'
				marginTop='auto'
				alignItems='center'
				paddingBottom='16px'
			>
				{warning ? <Text size='xlarge'>{warning}</Text> : null}
				<Button marginLeft='auto' onClick={handleAdvanceStep}>
					Next Step
				</Button>
			</Box>
		</React.Fragment>
	)
}

interface TableCardProps {
	table: Table
	isSelected: boolean
	handleSelectTable(id: string): void
}

function TableCard(props: TableCardProps) {
	const { table, isSelected, handleSelectTable } = props
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
}
