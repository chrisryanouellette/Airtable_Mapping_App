import { Base, Field, View } from '@airtable/blocks/models'
import { Box, Button, Text } from '@airtable/blocks/ui'
import React, { useEffect, useState } from 'react'
import { createRefName, splitRefName } from '../helpers'
import { UpdateMappings } from '../hooks/useMappings'
import { TableMapping, ViewMapping } from '../types'
import { Container } from './styled'
import { Card } from './styled/card'

interface SelectFieldProps {
	step: number
	base: Base
	tableMappings: { [refName: string]: TableMapping }
	viewMappings: { [refName: string]: ViewMapping }
	updateMappings: UpdateMappings
	previousStep(): void
}

export function SelectFields(props: SelectFieldProps) {
	const [fields, setfields] = useState<{ [viewId: string]: Field[] }>({})
	const [selectedFields, setselectedFields] = useState<{
		[viewId: string]: string[]
	}>({})
	const [warning, setwarning] = useState<string>('')

	useEffect(() => {
		if (props.step !== 2) return
		const tables = Object.values(props.tableMappings).map((mapping) =>
			props.base.getTable(mapping.id)
		)
		const fields: { [viewId: string]: Field[] } = {}
		tables.map((table) => {
			table.views
				.filter((view) =>
					Object.values(props.viewMappings).some(
						(mapping) => mapping.id === view.id
					)
				)
				.forEach((view) => (fields[view.id] = table.fields))
			return [table.id, table.views]
		})
		const selectedFields: { [viewId: string]: string[] } = {}
		Object.values(props.viewMappings).forEach((mapping) => {
			selectedFields[mapping.id] = Object.values(mapping.fields).map(
				(field) => field.id
			)
		})

		setfields(fields)
		setselectedFields(selectedFields)
	}, [props.step])

	function handleSelectField(viewId: string, id: string): void {
		const fields = { ...selectedFields }
		const fieldInView = [...fields[viewId]] || []
		if (fieldInView.includes(id)) {
			fieldInView.splice(fieldInView.indexOf(id), 1)
		} else {
			fieldInView.push(id)
		}
		fields[viewId] = fieldInView
		setselectedFields(fields)
	}

	function handleAdvanceStep() {
		const viewMappings: { [refName: string]: ViewMapping } = {}
		Object.entries(selectedFields).forEach(([viewId, ids]) => {
			let viewMapping: ViewMapping = Object.values(
				props.viewMappings
			).find((mapping) => mapping.id === viewId)
			let tableMapping: TableMapping = Object.values(
				props.tableMappings
			).find((mapping) => mapping.id === viewMapping.tableId)

			ids.forEach((id) => {
				let field: Field = null
				Object.entries(fields).some(([viewId, fields]) => {
					field = fields.find((f) => f.id === id)
					if (field) return true
				})
				let refName = createRefName(field.name)
				if (viewMapping.fields[refName]) {
					refName =
						refName + Math.floor(Math.random() * 100).toString()
				}
				viewMapping.fields[refName] = {
					id: field.id,
					tableId: tableMapping.id,
					viewId: viewMapping.id,
					name: field.name,
					type: field.type,
					refName,
				}
				viewMappings[viewMapping.refName] = viewMapping
			})
		})
		props.updateMappings('views', viewMappings)
	}

	if (props.step !== 2) return null
	return (
		<React.Fragment>
			<Text size='large'>
				Then select all the fields that will be used by the App or
				Automation.
			</Text>
			{Object.entries(fields).map(([viewId, fields], index) => {
				const viewMapping = Object.values(props.viewMappings).find(
					(mapping) => mapping.id === viewId
				)
				const tableMapping = Object.values(props.tableMappings).find(
					(mapping) => mapping.id === viewMapping.tableId
				)
				return (
					<Container key={index} marginTop='16px'>
						<Text size='large'>
							{tableMapping.name} - {viewMapping.name}
						</Text>
						<Container
							display='flex'
							flexWrap='wrap'
							justifyContent='flex-start'
							margin='1% 0'
						>
							{fields.map((field) =>
								FieldCard({
									viewId,
									field,
									isSelected: selectedFields[
										viewId
									]?.includes(field.id),
									handleSelectField,
								})
							)}
						</Container>
					</Container>
				)
			})}
			<Box
				display='flex'
				marginTop='auto'
				alignItems='center'
				paddingBottom='16px'
			>
				<Button onClick={props.previousStep}>Previous Step</Button>
				<Text size='xlarge' margin='0 auto'>
					{warning ? warning : ''}
				</Text>
				<Button onClick={handleAdvanceStep}>Next Step</Button>
			</Box>
		</React.Fragment>
	)
}

interface FieldCardProps {
	viewId: string
	field: Field
	isSelected: boolean
	handleSelectField(viewId: string, id: string): void
}

function FieldCard(props: FieldCardProps) {
	const { viewId, field, isSelected, handleSelectField } = props
	return (
		<Card key={field.id} flow='column'>
			<Text size='large'>{field.name}</Text>
			<Text height='inherit'>
				{splitRefName(field.type)}
				{field.isComputed ? ' - Computed' : ''}
			</Text>
			{field.description ? (
				<Text height='inherit' overflow='auto'>
					{field.description}
				</Text>
			) : null}
			<Container marginTop='7px'>
				<Button
					width='100%'
					variant={isSelected ? 'primary' : 'default'}
					onClick={() => handleSelectField(viewId, field.id)}
				>
					{isSelected ? 'Remove' : 'Add'}
				</Button>
			</Container>
		</Card>
	)
}
