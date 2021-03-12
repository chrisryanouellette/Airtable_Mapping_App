import { initializeBlock, useBase, Heading, Box } from '@airtable/blocks/ui'
import { Base } from '@airtable/blocks/models'
import React, { useEffect, useState } from 'react'
import { Body, Main } from './components/styled'
import { SelectTables } from './components/tables'

function MappingApp() {
	const base = useBase() as Base
	const [step, setstep] = useState(0)

	useEffect(() => {
		const head = document.querySelector('html head')
		const styles = [
			'*::-webkit-scrollbar {width: .4rem}',
			'*::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.00);border-radius: 5px}',
			'*::-webkit-scrollbar-thumb {background-color: #666666;border-radius: 5px}',
		]
		styles.map((style) => {
			const styleElem = document.createElement('style')
			styleElem.innerHTML = style
			head.appendChild(styleElem)
		})
	}, [])

	return (
		<Main>
			<Heading size='large'>Mapping App</Heading>
			<Body>
				<SelectTables step={step} base={base} />
			</Body>
		</Main>
	)
}

initializeBlock(() => <MappingApp />)
