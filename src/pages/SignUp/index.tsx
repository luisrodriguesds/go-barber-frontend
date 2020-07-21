import React, { useCallback, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom';

import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { Container, Content, Background, AnimationContainer } from './styles'
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi'
import * as Yup from 'yup'

import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'
import logo from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../context/toast'


interface SignUpData {
	name: string
	email: string
	password: string
}

const SignUp: React.FC = () => {
	const formRef = useRef<FormHandles>(null)
	const { addToast } = useToast()
	const history = useHistory()
	const handleSubmit = useCallback( async (data: SignUpData) => {
		try {
			formRef.current?.setErrors({})

			const schema = Yup.object().shape({
				name: Yup.string().required('Campo Obrigatório'),
				email: Yup.string().required('Campo Obrigatório').email('Email inválido'),
				password: Yup.string().min(6, 'No mínimo 6 digitos')
			})

			await schema.validate(data, {
				abortEarly: false
			})

			await api.post('/user', data)
			
			history.push('/')

			addToast({
				title: 'Cadastro realizado com sucesso!',
				type: 'success',
				description: 'Você já pode fazer seu login.'
			})

		} catch (error) {
			if (error instanceof Yup.ValidationError) {
				const errors = getValidationErrors(error)
				formRef.current?.setErrors(errors)
				return
			}
			addToast({
				title: 'Ops ...',
				type: 'error',
				description: 'Ocorreu algum error!'
			})
		}
	}, [addToast, history])

	return (
		<Container>
			<Background />
			<Content>
				<AnimationContainer>
					<img src={logo} alt="GoBarber" />
					<Form onSubmit={handleSubmit} ref={formRef}>
						<h1> Faça seu Cadastro </h1>

						<Input type="text" icon={FiUser} name="name" placeholder="Nome" />
						
						<Input type="email" icon={FiMail} name="email" placeholder="E-mail" />

						<Input type="password" icon={FiLock} name="password" placeholder="Senha" />

						<Button type="submit">Cadastrar</Button>

					</Form>

					<Link to="/">
						<FiArrowLeft />
						Voltar
					</Link>

				</AnimationContainer>
			</Content>

		</Container>
	)
}

export default SignUp