import React, { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { Form } from '@unform/web'

import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import getValidationErrors from '../../utils/getValidationErrors'
import logo from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../context/toast'
import api from '../../services/api';

const SignIn: React.FC = () => {
	const [loading, setLoading] = useState(false)
	const formRef = useRef<FormHandles>(null)
	const { addToast } = useToast()
	const handleSubmit = useCallback( async (data: { email: string, password: string }) => {
		try {
			setLoading(true)
			formRef.current?.setErrors({})

			const schema = Yup.object().shape({
				email: Yup.string().required('Campo Obrigatório').email('Email inválido'),
			})

			await schema.validate(data, {
				abortEarly: false
			})

			await api.post('/password/forgot', {
				email: data.email
			})
			addToast({
				title: 'Sucesso!',
				type: 'success',
				description: 'Check sua caixa de entrada'
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
		} finally{
			setLoading(false)
		}
	}, [addToast])

	return (
		<Container>
			<Content>
				<AnimationContainer>
					<img src={logo} alt="GoBarber" />
					<Form onSubmit={handleSubmit} ref={formRef}>
						<h1> Recuperar Senha </h1>

						<Input type="email" icon={FiMail} name="email" placeholder="E-mail" />


						<Button loading={loading} type="submit">Enviar</Button>

						<Link to="/">Login</Link>
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