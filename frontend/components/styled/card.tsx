import React from 'react'
import { StyledComponentProps } from '.'

interface CardProps extends StyledComponentProps {
	flow?: 'row' | 'column'
}

function CardWrapper(props: StyledComponentProps) {
	return (
		<div
			className='card-wrapper'
			style={{
				height: '0',
				paddingBottom: '100%',
				width: '100%',
			}}
		>
			{props.children}
		</div>
	)
}

function CardBody(props: CardProps) {
	return (
		<div
			className='card-body'
			style={{
				boxSizing: 'content-box',
				display: 'flex',
				flexFlow: props.flow || 'row',
				height: 'clamp(0px, calc(100vw * .19), 165px)',
				justifyContent: 'space-between',
			}}
		>
			{props.children}
		</div>
	)
}

export function Card(props: CardProps) {
	return (
		<div
			className='card-root'
			style={{
				backgroundColor: 'white',
				boxShadow: '1px 2px 5px rgba(0,0,0,0.5)',
				margin: '8px 16px',
				width: 'clamp(150px, 25%, 200px)',
				padding: '8px 16px',
			}}
		>
			<CardWrapper>
				<CardBody {...props}>{props.children}</CardBody>
			</CardWrapper>
		</div>
	)
}
