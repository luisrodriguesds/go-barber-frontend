import React, { createContext, useCallback, useState, useContext } from 'react'
import api from '../services/api'

interface User {
  id: string;
  avatar_url: string;
  name: string;
}
interface AuthState{
  token: string
  user: User
}

interface AuthContextState {
  signIn(credentials: {
    email: string
    password: string
  }): Promise<void>
  signOut(): void
  user: User
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState)

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@gobarber:token')
    const user = localStorage.getItem('@gobarber:user')

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`
      return { token, user: JSON.parse(user) }
    }
    return {} as AuthState
  })

  const signIn = useCallback(async ({ email, password }) => {
    const res = await api.post('/session', {email, password})
    const { token, user } = res.data
    localStorage.setItem('@gobarber:token', token)
    localStorage.setItem('@gobarber:user', JSON.stringify(user))

    api.defaults.headers.authorization = `Bearer ${token}`
    setData({ token, user })
  }, [])

  const signOut = useCallback((): void => {
    localStorage.removeItem('@gobarber:token')
    localStorage.removeItem('@gobarber:user')
    setData({} as AuthState)
  }, [])

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext)

  if(!context){
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
} 
