import { Box, Button, Input, Label, Select, Text } from '@airtable/blocks/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { UpdateMappings } from '../hooks/useMappings'
import { AllMappings, BaseMapping, FieldMapping, Mappings } from '../types'
import { Container } from './styled'

type SelectOption = { value: string; label: string }

interface EditReferenceNamesProps {
	step: number
	mappings: Mappings
	updateMappings: UpdateMappings
	advanceStep(): void
	previousStep(): void
}

export function EditReferenceNames(props: EditReferenceNamesProps) {
	const [selectedBase, setselectedBase] = useState<string>('')
	const [selectedTable, setselectedTable] = useState<string>('')
	const [selectedView, setselectedView] = useState<string>('')
	const [selectedField, setselectedField] = useState<string>('')
	const [changedRefNames, setchangedRefNames] = useState<{
		bases: { [id: string]: { id: string; refName: string } }
		tables: { [id: string]: { id: string; refName: string } }
		views: { [id: string]: { id: string; refName: string } }
		field: { [id: string]: { id: string; refName: string } }
	}>({ bases: {}, tables: {}, views: {}, field: {} })
	const [warning, setwarning] = useState<string>('')

	useEffect(() => {
		setselectedBase(Object.values(props.mappings.bases)[0]?.id || '')
	}, [props.step, !!Object.keys(props.mappings.bases).length])

	useEffect(() => {
		setselectedTable(Object.values(props.mappings.tables)[0]?.id || '')
	}, [props.step, !!Object.keys(props.mappings.tables).length])

	const defaultValue = useMemo<SelectOption[]>(
		() => [{ value: '', label: '' }],
		[]
	)

	function returnRefName(
		key: 'bases' | 'tables' | 'views' | 'field',
		id: string
	): string {
		if (key === 'field') {
			return (
				Object.values(changedRefNames[key] || {}).find(
					(mapping) => mapping.id === id
				)?.refName ||
				Object.values(
					Object.values(props.mappings.views).find(
						(view) => view.id === selectedView
					)?.fields || {}
				).find((field) => field.id === id)?.refName ||
				''
			)
		} else {
			return (
				Object.values(changedRefNames[key] || {}).find(
					(mapping) => mapping.id === id
				)?.refName ||
				Object.values(props.mappings[key]).find(
					(mapping) => mapping.id === id
				)?.refName ||
				''
			)
		}
	}

	function concat(...arrays: SelectOption[][]): SelectOption[] {
		return [].concat(arrays).flat()
	}

	function clearForm() {
		setselectedBase('')
		setselectedTable('')
		setselectedView('')
		setselectedField('')
	}

	function handleSelectMapping(
		key: 'base' | 'table' | 'view' | 'field',
		id: string
	): void {
		if (!id) return
		switch (key) {
			case 'base':
				setselectedBase(id)
			case 'table':
				setselectedTable(key === 'table' ? id : '')
			case 'view':
				setselectedView(key === 'view' ? id : '')
			case 'field':
				setselectedField(key === 'field' ? id : '')
				break
		}
	}

	function handleEditRefName(
		key: 'bases' | 'tables' | 'views' | 'field',
		id: string,
		value: string
	) {
		if (key === 'field') {
			changedRefNames[key][id] = {
				id,
				refName: value,
			}
		} else {
			const mapping: { id: string; refName: string } | AllMappings =
				Object.values(changedRefNames[key]).find((m) => m.id === id) ||
				Object.values(props.mappings[key]).find((m) => m.id === id)
			const item = {
				id: mapping.id,
				refName: mapping.refName,
			}
			item.refName = value
			changedRefNames[key][id] = item
		}
		setchangedRefNames({ ...changedRefNames })
	}

	function handleAdvanceStep() {
		Object.entries(changedRefNames).forEach(
			([key, updates]: [
				'bases' | 'tables' | 'views' | 'field',
				{ [index: string]: { id: string; refName: string } }
			]) => {
				if (key === 'field') {
					const mappings = props.mappings.views
					Object.values(updates).forEach((update) => {
						let fieldMapping: FieldMapping = null
						const [refName, viewMapping] = Object.entries(
							props.mappings.views
						).find(([refName, view]) => {
							return Object.values(view.fields).find((field) => {
								if (field.id === update.id) {
									fieldMapping = field
									return true
								}
							})
						})
						const originalRefName = fieldMapping.refName
						fieldMapping.refName = update.refName
						mappings[refName].fields[update.refName] = fieldMapping
						delete mappings[refName].fields[originalRefName]
					})
					props.updateMappings('views', mappings)
				} else {
					const mappings: { [index: string]: AllMappings } =
						props.mappings[key]
					Object.values(updates).forEach((update) => {
						const mapping = Object.values(mappings).find(
							(m) => m.id === update.id
						)
						const originalRefName = mapping.refName
						mapping.refName = update.refName
						mappings[update.refName] = mapping
						delete mappings[originalRefName]
					})
					props.updateMappings(key, mappings)
				}
			}
		)
		setchangedRefNames({ bases: {}, tables: {}, views: {}, field: {} })
		clearForm()
		props.advanceStep()
	}

	if (props.step !== 3) return null
	return (
		<React.Fragment>
			<Text size='large'>
				Finally, rename the Base, Tables, Views, or Field reference
				names if needed.
			</Text>
			<Container width='clamp(0px, 100vw, 300px)' margin='16px 0'>
				<Label htmlFor='select-base'>Base</Label>
				<Select
					id='select-base'
					options={concat(
						defaultValue,
						Object.values(props.mappings.bases).map((mapping) => ({
							value: mapping.id,
							label: mapping.name,
						}))
					)}
					value={selectedBase}
					onChange={(e) => handleSelectMapping('base', e.toString())}
				/>
				<Input
					placeholder='Base Ref Name'
					marginTop='8px'
					value={returnRefName('bases', selectedBase)}
					onChange={(e) =>
						handleEditRefName('bases', selectedBase, e.target.value)
					}
				/>
			</Container>
			<Container width='clamp(0px, 100vw, 300px)' margin='16px 0'>
				<Label htmlFor='select-table'>Table</Label>
				<Select
					id='select-table'
					options={concat(
						defaultValue,
						Object.values(props.mappings.tables)
							.filter(
								(mapping) => mapping.baseId === selectedBase
							)
							.map((mapping) => ({
								value: mapping.id,
								label: mapping.name,
							}))
					)}
					value={selectedTable}
					onChange={(e) => handleSelectMapping('table', e.toString())}
				/>
				<Input
					placeholder='Table Ref Name'
					marginTop='8px'
					value={returnRefName('tables', selectedTable)}
					onChange={(e) =>
						handleEditRefName(
							'tables',
							selectedTable,
							e.target.value
						)
					}
				/>
			</Container>
			<Container width='clamp(0px, 100vw, 300px)' margin='16px 0'>
				<Label htmlFor='select-view'>View</Label>
				<Select
					id='select-view'
					options={concat(
						defaultValue,
						Object.values(props.mappings.views)
							.filter(
								(mapping) => mapping.tableId === selectedTable
							)
							.map((mapping) => ({
								value: mapping.id,
								label: mapping.name,
							}))
					)}
					value={selectedView}
					onChange={(e) => handleSelectMapping('view', e.toString())}
				/>
				<Input
					placeholder='View Ref Name'
					marginTop='8px'
					value={returnRefName('views', selectedView)}
					onChange={(e) =>
						handleEditRefName('views', selectedView, e.target.value)
					}
				/>
			</Container>
			<Container width='clamp(0px, 100vw, 300px)' margin='16px 0'>
				<Label htmlFor='select-field'>Field</Label>
				<Select
					id='select-field'
					options={concat(
						defaultValue,
						Object.values(
							Object.values(props.mappings.views).find(
								(mapping) => mapping.id === selectedView
							)?.fields || {}
						).map((mapping) => ({
							value: mapping.id,
							label: mapping.name,
						}))
					)}
					value={selectedField}
					onChange={(e) => handleSelectMapping('field', e.toString())}
				/>
				<Input
					placeholder='Field Ref Name'
					marginTop='8px'
					value={returnRefName('field', selectedField)}
					onChange={(e) =>
						handleEditRefName(
							'field',
							selectedField,
							e.target.value
						)
					}
				/>
			</Container>
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
