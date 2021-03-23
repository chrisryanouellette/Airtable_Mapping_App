import { Button, Dialog, Heading, Text } from '@airtable/blocks/ui'
import React, { useEffect, useState } from 'react'
import { findArrDiff, parseMappings, splitRefName } from '../helpers'
import { Mappings } from '../types'
import { Container } from './styled'
import TextArea from './styled/textarea'

interface MappingDiffDialogProps {
	showMappingDiffDialog: boolean
	onClose(): void
}

export function MappingDiffDialog(props: MappingDiffDialogProps) {
	const [rootMappings, setrootMappings] = useState<Mappings>(null)
	const [newMappings, setnewMappings] = useState<Mappings>(null)
	const [diffrences, setdiffrences] = useState<{
		bases: string[]
		tables: string[]
		views: string[]
		fields: [string, string[]][]
	}>({
		bases: [],
		tables: [],
		views: [],
		fields: [],
	})

	function compareMappings() {
		if (!rootMappings || !newMappings) return
		const baseDiff = findArrDiff(
			Object.keys(rootMappings.bases),
			Object.keys(newMappings.bases)
		)
		const tableDiff = findArrDiff(
			Object.keys(rootMappings.tables),
			Object.keys(newMappings.tables)
		)
		const viewDiff = findArrDiff(
			Object.keys(rootMappings.views),
			Object.keys(newMappings.views)
		)
		const viewOverlap = Object.keys(rootMappings.views).filter((refName) =>
			Object.keys(newMappings.views).includes(refName)
		)
		const fieldDiff: [string, string[]][] = viewOverlap.map((refName) => [
			refName,
			findArrDiff(
				Object.keys(rootMappings.views[refName].fields),
				Object.keys(newMappings.views[refName].fields)
			),
		])
		console.log(baseDiff, tableDiff, viewDiff, fieldDiff)
		setdiffrences({
			bases: baseDiff,
			tables: tableDiff,
			views: viewDiff,
			fields: fieldDiff.filter(([viewName, fields]) => fields.length),
		})
	}

	return (
		props.showMappingDiffDialog && (
			<Dialog onClose={props.onClose} maxHeight='75vh'>
				<Heading>Mapping Differences</Heading>
				<Text>Enter base / root mappings.</Text>
				<TextArea
					value={
						rootMappings
							? JSON.stringify(rootMappings, undefined, 4)
							: ''
					}
					onChange={(e) =>
						setrootMappings(parseMappings(e.target.value))
					}
				/>
				<Text>Enter new mappings.</Text>
				<TextArea
					value={
						newMappings
							? JSON.stringify(newMappings, undefined, 4)
							: ''
					}
					onChange={(e) =>
						setnewMappings(parseMappings(e.target.value))
					}
				/>
				<Container padding='16px 0' display='grid' gridRowGap='8px'>
					<Text>Unmatched Reference Names</Text>
					{diffrences.bases.length ? (
						<Text>Bases: {diffrences.bases.join(', ')}</Text>
					) : null}
					{diffrences.tables.length ? (
						<Text>Tables: {diffrences.tables.join(', ')}</Text>
					) : null}
					{diffrences.views.length ? (
						<Text>Views: {diffrences.views.join(', ')}</Text>
					) : null}
					{diffrences.fields.length
						? diffrences.fields.map(([viewName, fields]) => (
								<Text key={viewName}>
									{splitRefName(viewName)}:{' '}
									{fields.join(', ')}
								</Text>
						  ))
						: null}
				</Container>
				<Button onClick={compareMappings}>Compare</Button>
			</Dialog>
		)
	)
}
