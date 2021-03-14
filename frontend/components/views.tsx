import { Base, View } from '@airtable/blocks/models'
import { Box, Button, Text } from '@airtable/blocks/ui'
import React, { useEffect, useState } from 'react'
import { createRefName } from '../helpers'
import { UpdateMappings } from '../hooks/useMappings'
import { TableMapping, ViewMapping } from '../types'
import { Container } from './styled'
import { Card } from './styled/card'

interface SelectViewProps {
	step: number
	base: Base
	tableMappings: { [refName: string]: TableMapping }
	viewMappings: { [refName: string]: ViewMapping }
	updateMappings: UpdateMappings
	previousStep(): void
}

export function SelectViews(props: SelectViewProps) {
	const [views, setviews] = useState<{ [tableId: string]: View[] }>({})
	const [selectedViews, setselectedViews] = useState<string[]>([])
	const [warning, setwarning] = useState<string>('')

	useEffect(() => {
		if (props.step !== 1) return
		const tables = Object.values(props.tableMappings).map((mapping) =>
			props.base.getTable(mapping.id)
		)
		const views = Object.fromEntries(
			tables.map((table) => [table.id, table.views])
		)
		setviews(views)
		setselectedViews(
			Object.values(props.viewMappings).map((mapping) => mapping.id)
		)
	}, [props.step])

	function handleSelectView(id: string): void {
		const views = [...selectedViews]
		if (views.includes(id)) {
			views.splice(views.indexOf(id), 1)
		} else {
			views.push(id)
		}
		setselectedViews(views)
	}

	function handleAdvanceStep() {
		if (!selectedViews.length) {
			return setwarning(`Select at least one view.`)
		}
		const viewMappings: { [refName: string]: ViewMapping } = {}
		selectedViews.forEach((id) => {
			let tableId: string = null
			let view: View = null
			Object.entries(views).some(([key, views]) => {
				view = views.find((v) => v.id === id)
				if (view) {
					tableId = key
					return true
				}
			})

			let refName = createRefName(view.name)
			if (viewMappings[refName]) {
				refName = refName + Math.floor(Math.random() * 100).toString()
			}
			viewMappings[refName] = {
				id: view.id,
				name: view.name,
				tableId,
				refName,
				fields: {},
			}
		})
		props.updateMappings('views', viewMappings)
	}

	if (props.step !== 1) return null
	return (
		<React.Fragment>
			<Text size='large'>
				Now select all the views that will be used by the App or
				Automation.
			</Text>
			{Object.entries(views).map(([tableId, views], index) => (
				<Container key={index} marginTop='16px'>
					<Text size='large'>
						{props.base.getTable(tableId).name}
					</Text>
					<Container
						display='flex'
						flexWrap='wrap'
						justifyContent='flex-start'
						margin='1% 0'
					>
						{views.map((view) =>
							ViewCard({
								view,
								isSelected: selectedViews.includes(view.id),
								handleSelectView,
							})
						)}
					</Container>
				</Container>
			))}
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

interface ViewCardProps {
	view: View
	isSelected: boolean
	handleSelectView(id: string): void
}

function ViewCard(props: ViewCardProps) {
	const { view, isSelected, handleSelectView } = props
	return (
		<Card key={view.id} flow='column'>
			<Text size='large'>{view.name}</Text>
			<Container marginTop='7px'>
				<Button
					width='100%'
					variant={isSelected ? 'primary' : 'default'}
					onClick={() => handleSelectView(view.id)}
				>
					{isSelected ? 'Remove' : 'Add'}
				</Button>
			</Container>
		</Card>
	)
}
