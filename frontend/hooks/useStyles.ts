import { useEffect } from 'react'

export function useStyles(): void {
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
}
