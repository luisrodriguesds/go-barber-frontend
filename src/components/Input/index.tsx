import React, { InputHTMLAttributes, useEffect, useRef, useState, useCallback } from 'react'
import { Container, Error } from './styles'
import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import { useField } from '@unform/core'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string
	icon: React.ComponentType<IconBaseProps>
}

const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest}) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [isFocused, setIsFocused] = useState(false)
	const [isFilled, setIsFilled] = useState(false)
	const { fieldName, defaultValue, error, registerField } = useField(name)
	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			path: 'value'
		})
	}, [fieldName, registerField])

	// Para não dar render na função sempre que o estado mudar, coisa de otimização
	const handleBlur = useCallback(() => {
		setIsFocused(false)
		setIsFilled(!!inputRef.current?.value)
	}, [])

	const handleFocus = useCallback(() => {
		setIsFocused(true)
	}, [])

	return (
		<Container isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
			{Icon && <Icon size={20} />}
			<input 
				defaultValue={defaultValue} 
				ref={inputRef} {...rest} 
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>

			{error && (
				<Error title={error}>
					<FiAlertCircle color="#c53030" size={20} />
				</Error>
			)}
		</Container>
	)
}

export default Input

