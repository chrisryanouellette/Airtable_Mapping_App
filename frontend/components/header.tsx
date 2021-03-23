import { Button, Heading, Icon } from '@airtable/blocks/ui'
import React from 'react'
import { Container } from './styled'

interface HeaderProps {
	step: number
	showSettingMenu(): void
	showMappingDiffDialog(): void
}

export function Header(props: HeaderProps) {
	return (
		<header>
			<Container
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				width='100%'
			>
				<Heading size='large'>Mapping App</Heading>
				<Container display='flex' gap='16px'>
					{props.step === 0 && (
						<Button
							icon={<Icon name='edit' />}
							aria-label='edit mappings'
							onClick={props.showSettingMenu}
						/>
					)}
					<Button
						icon={<Icon name='lookup' />}
						aria-label='compare mappings'
						onClick={props.showMappingDiffDialog}
					/>
				</Container>
			</Container>
		</header>
	)
}
