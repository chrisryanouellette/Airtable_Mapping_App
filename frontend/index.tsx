import { initializeBlock, useBase, Heading, Box } from '@airtable/blocks/ui'
import { Base } from '@airtable/blocks/models'
import React, { useEffect, useState } from 'react'
import { Body, Main } from './components/styled'
import { SelectTables } from './components/tables'
import { useStyles } from './hooks/useStyles'
import { UpdateMappings, useMappings } from './hooks/useMappings'
import { SelectViews } from './components/views'
import { SelectFields } from './components/fields'
import { createRefName } from './helpers'
import { BaseMapping } from './types'
import { EditReferenceNames } from './components/editNames'
import { OutputMappings } from './components/output'

function MappingApp() {
	const base = useBase() as Base
	const [step, setstep] = useState(0)
	const { mappings, setMappings } = useMappings()

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

	console.log(mappings)

	useStyles()

	return (
		<Main>
			<Heading size='large'>Mapping App</Heading>
			<Body>
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
