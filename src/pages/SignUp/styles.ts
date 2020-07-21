import styled, { keyframes } from 'styled-components'
import signupBackground from '../../assets/sign-up-background.png'

import { shade } from 'polished'

export const Container = styled.div`
	height: 100vh;

	display: flex;
	align-items: stretch;
`

const appearFromRight = keyframes`
	from{
		opacity: 0;
		transform: translateX(50px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
`
export const AnimationContainer = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	animation: ${appearFromRight} 1s;

	form{
		margin: 80px 0;
		width: 340px;
		text-align: center;

		display: flex;
		flex-direction: column;

		h1 {
			margin-bottom: 24px;
		}

		

		/*Somente os a's do pai*/
		> a {
			color: #F4EDE8;
			text-decoration: none;
			margin-top: 24px;
			transition: color 0.2s;
			&:hover{
				color: ${shade(0.2, '#F4EDE8')}
			}
		}
	}

	> a {
		color: #ff9000;
		text-decoration: none;
		margin-top: 24px;
		transition: color 0.2s;
		align-items: center;
		justify-content: center;

		&:hover{
			color: ${shade(0.2, '#ff9000')}
		}

		svg {
			margin-right: 16px;
		}
	}
`

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	width: 100%;
	max-width: 700px;
`

export const Background = styled.div`
	flex: 1;
	background: url(${signupBackground}) no-repeat center;
	background-size: cover;
`