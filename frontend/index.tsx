import {
	initializeBlock,
	useBase,
	Heading,
	Text,
	Dialog,
} from '@airtable/blocks/ui'
import { Base } from '@airtable/blocks/models'
import React, { useCallback, useEffect, useState } from 'react'
import { Body, Main } from './components/styled'
import { SelectTables } from './components/tables'
import { useStyles } from './hooks/useStyles'
import { UpdateMappings, useMappings } from './hooks/useMappings'
import { SelectViews } from './components/views'
import { SelectFields } from './components/fields'
import { createRefName } from './helpers'
import { AllMappings, BaseMapping, Mappings } from './types'
import { EditReferenceNames } from './components/editNames'
import { OutputMappings } from './components/output'
import { Header } from './components/header'
import { TextArea } from './components/styled/textarea'

function MappingApp() {
	const base = useBase() as Base
	const [step, setstep] = useState(0)
	const { mappings, setMappings } = useMappings()
	const [showMappingSettings, setshowMappingSettings] = useState<boolean>(
		false
	)

	const updateMappings: UpdateMappings = (key, newMappings) => {
		try {
			setMappings(key, newMappings)
			setstep(step + 1)
		} catch (error) {
			console.error(error.message)
		}
	}

	useEffect(() => {
		const refName = createRefName(base.name)
		const baseMappings: { [refName: string]: BaseMapping } = {
			[refName]: {
				id: base.id,
				name: base.name,
				refName,
				tables: {},
			},
		}
		setMappings('bases', baseMappings)
	}, [])

	const handleExistingMappings = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			try {
				const mappings: Mappings = JSON.parse(e.target.value)
				if (!mappings?.bases || !mappings.tables || !mappings.views) {
					throw new Error(
						'Missing required field in mappings ( bases, tables, or views ).'
					)
				}
				Object.entries(mappings).forEach(
					([key, mapping]: [
						'bases' | 'tables' | 'views',
						{ [index: string]: AllMappings }
					]) => {
						setMappings(key, mapping)
					}
				)
			} catch (error) {
				console.error(error.message)
			}
		},
		[]
	)

	console.log(mappings)

	useStyles()

	return (
		<Main>
			<Header
				step={step}
				showSettingMenu={() => setshowMappingSettings(true)}
			/>
			<Body>
				{showMappingSettings && (
					<Dialog
						onClose={() => setshowMappingSettings(false)}
						width='75%'
					>
						<Heading>Mapping Settings</Heading>
						<Text>Enter existing local or remote mappings.</Text>
						<TextArea
							value={JSON.stringify(mappings, undefined, 4)}
							onChange={handleExistingMappings}
						/>
					</Dialog>
				)}
				<SelectTables
					step={step}
					base={base}
					tableMappings={mappings.tables}
					updateMappings={updateMappings}
				/>
				<SelectViews
					step={step}
					base={base}
					tableMappings={mappings.tables}
					viewMappings={mappings.views}
					updateMappings={updateMappings}
					previousStep={() => setstep(0)}
				/>
				<SelectFields
					step={step}
					base={base}
					tableMappings={mappings.tables}
					viewMappings={mappings.views}
					updateMappings={updateMappings}
					previousStep={() => setstep(1)}
				/>
				<EditReferenceNames
					step={step}
					mappings={mappings}
					previousStep={() => setstep(2)}
					advanceStep={() => setstep(4)}
					updateMappings={setMappings}
				/>
				<OutputMappings
					step={step}
					mappings={mappings}
					previousStep={() => setstep(3)}
				/>
			</Body>
		</Main>
	)
}

initializeBlock(() => <MappingApp />)
