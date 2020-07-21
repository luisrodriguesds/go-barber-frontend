import React, { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'

import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import getValidationErrors from '../../utils/getValidationErrors'
import logo from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useAuth } from '../../context/auth'
import { useToast } from '../../context/toast'

const SignIn: React.FC = () => {
	const formRef = useRef<FormHandles>(null)
	const { signIn } = useAuth()
	const { addToast } = useToast()
	const handleSubmit = useCallback( async (data: { email: string, password: string }) => {
		try {
			formRef.current?.setErrors({})

			const schema = Yup.object().shape({
				email: Yup.string().required('Campo Obrigatório').email('Email inválido'),
				password: Yup.string().required('Campo Obrigatório')
			})

			await schema.validate(data, {
				abortEarly: false
			})
			await signIn(data)
			addToast({
				title: 'Sucesso!',
				type: 'success',
				description: 'Login realizado com sucesso!'
			})
		} catch (error) {
			if (error instanceof Yup.ValidationError) {
				const errors = getValidationErrors(error)
				formRef.current?.setErrors(errors)
				return
			}
			addToast({
				title: 'Opss ..',
				type: 'error',
				description: 'Ocorreu um erro ao fazer login, verifique suas credencias.'
			})
		}
	}, [addToast, signIn])

	return (
		<Container>
			<Content>
				<AnimationContainer>
					<img src={logo} alt="GoBarber" />
					<Form onSubmit={handleSubmit} ref={formRef}>
						<h1> Faça seu Login </h1>

						<Input type="email" icon={FiMail} name="email" placeholder="E-mail" />

						<Input type="password" icon={FiLock} name="password" placeholder="Senha" />

						<Button type="submit">Entrar</Button>

						<Link to="/forgot-password">Esqueci minha senha</Link>
					</Form>

					<Link to="/signup">
						<FiLogIn />
						Criar conta
					</Link>
				</AnimationContainer>
			</Content>
			<Background />
		</Container>
	)
}

export default SignIn