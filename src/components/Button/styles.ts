import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.button`
	background: #ff9000;
	height: 56px;
	border: 0;
	border-radius: 10px;
	padding: 0 16px;
	color: #312e38;
	width: 100%;
	font-weight: bold;
	margin-top: 16px;
	transition: 0.2s background;
	&:hover{
		background: ${shade(0.2, '#ff9000')}
	}
		
`