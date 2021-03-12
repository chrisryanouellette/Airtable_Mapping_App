import React from 'react'

interface StyledComponentProps {
	children: React.ReactNode
}

interface MainProps extends StyledComponentProps {}

export function Main(props: MainProps) {
	const style: React.CSSProperties = {
		height: '100vh',
		padding: '1%',
	}
	return <main style={style}>{props.children}</main>
}

export function Body(props: StyledComponentProps) {
	const style: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		padding: '2% 0',
		width: '100%',
		height: 'calc(100vh - 45px)',
	}
	return <div style={style}>{props.children}</div>
}

interface ContainerProps extends StyledComponentProps, React.CSSProperties {}

export function Container(props: ContainerProps) {
	const styles = { ...props }
	delete styles.children

	return <div style={styles || {}}>{props.children}</div>
}

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
				width: '25%',
				maxWidth: '200px',
				padding: '8px 16px',
			}}
		>
			<CardWrapper>
				<CardBody {...props}>{props.children}</CardBody>
			</CardWrapper>
		</div>
	)
}
