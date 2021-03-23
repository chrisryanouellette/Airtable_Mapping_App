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
import { createRefName, parseMappings } from './helpers'
import { AllMappings, BaseMapping } from './types'
import { EditReferenceNames } from './components/editNames'
import { OutputMappings } from './components/output'
import { Header } from './components/header'
import TextArea from './components/styled/textarea'
import { MappingDiffDialog } from './components/mappingDiffDialog'

function MappingApp() {
	const base = useBase() as Base
	const [step, setstep] = useState(0)
	const { mappings, setMappings } = useMappings()
	const [showMappingSettings, setshowMappingSettings] = useState<boolean>(
		false
	)
	const [showMappingDiffDialog, setshowMappingDiffDialog] = useState<boolean>(
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
			const mappings = parseMappings(e.target.value)
			if (mappings) {
				Object.entries(mappings).forEach(
					([key, mapping]: [
						'bases' | 'tables' | 'views',
						{ [index: string]: AllMappings }
					]) => {
						setMappings(key, mapping)
					}
				)
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
				showMappingDiffDialog={() => setshowMappingDiffDialog(true)}
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
				<MappingDiffDialog
					showMappingDiffDialog={showMappingDiffDialog}
					onClose={() => setshowMappingDiffDialog(false)}
				/>
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
