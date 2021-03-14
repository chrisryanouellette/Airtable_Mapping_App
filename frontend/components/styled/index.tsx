import React from 'react'

export interface StyledComponentProps {
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
		paddingTop: '16px',
		width: '100%',
		height: 'calc(100vh - 55px)',
	}
	return <div style={style}>{props.children}</div>
}

interface ContainerProps extends StyledComponentProps, React.CSSProperties {}

export function Container(props: ContainerProps) {
	const styles = { ...props }
	delete styles.children

	return <div style={styles || {}}>{props.children}</div>
}
