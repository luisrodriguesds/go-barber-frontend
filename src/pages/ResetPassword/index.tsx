import React, { useCallback, useRef } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles'
import {FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'

import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import getValidationErrors from '../../utils/getValidationErrors'
import logo from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../context/toast'
import api from '../../services/api';

const ResetPassword: React.FC = () => {
	const formRef = useRef<FormHandles>(null)
	const { addToast } = useToast()
	const history = useHistory()
	const location = useLocation()
	const handleSubmit = useCallback( async (data: { password_confirmation: string, password: string }) => {
		try {
			formRef.current?.setErrors({})

			const schema = Yup.object().shape({
				password: Yup.string().required('Campo Obrigatório'),
				password_confirmation:  Yup.string()
				.oneOf([Yup.ref('password'), undefined], 'Confirmar senha')
			})


			await schema.validate(data, {
				abortEarly: false
			})
			const token = location.search.replace('?token=', '')
			
			if (!token) {
				throw new Error('Token não encontrado')
			}

			await api.post('/password/reset', {
				password: data.password,
				password_confirmation: data.password_confirmation,
				token
			})

			addToast({
				title: 'Sucesso!',
				type: 'success',
				description: 'Login realizado com sucesso!'
			})

			history.push('/')
		} catch (error) {
			if (error instanceof Yup.ValidationError) {
				const errors = getValidationErrors(error)
				formRef.current?.setErrors(errors)
				return
			}
			addToast({
				title: 'Opss ..',
				type: 'error',
				description: 'Ocorreu um erro ao resetar sua senha'
			})
		}
	}, [addToast, history, location.search])

	return (
		<Container>
			<Content>
				<AnimationContainer>
					<img src={logo} alt="GoBarber" />
					<Form onSubmit={handleSubmit} ref={formRef}>
						<h1> Resetar seu senha </h1>


						<Input type="password" icon={FiLock} name="password" placeholder="Nova senha" />
						<Input type="password" icon={FiLock} name="password" placeholder="Confirmação de senha" />

						<Button type="submit">Alterar</Button>

						<Link to="/forgot-password">Esqueci minha senha</Link>
					</Form>

				</AnimationContainer>
			</Content>
			<Background />
		</Container>
	)
}

export default ResetPassword