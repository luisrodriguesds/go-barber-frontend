import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { isToday, format, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment, Section, Appontiment } from './styles';
import logoImg from '../../assets/logo.svg'
import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/auth';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import api from '../../services/api';
import { parseISO } from 'date-fns/esm';


interface MonthAvailability {
  day: number
  available: boolean
}

interface Appointiment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth() 
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth]= useState(new Date())
  const [appontiments, setAppontiments]= useState<Appointiment[]>([])
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailability[]>([])
  const handleDayChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day)
    }
  }, [])

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  //Para criação de outro formato de variavél a partir de outras
  const disabledDays = useMemo(() => {
    const dates = monthAvailability.filter(monthDay => monthDay.available === false).map(monthDay => {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()

      return new Date(year, month, monthDay.day)
    })

    return dates
  }, [currentMonth, monthAvailability])

  const selectDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR
    })
  }, [selectedDate])

  const selectWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR
    })
  }, [selectedDate])

  const morningAppointments = useMemo(() => {
    return appontiments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12
    })
  }, [appontiments])

  const afternoonAppointments = useMemo(() => {
    return appontiments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12
    })
  }, [appontiments])

  const nextAppointment = useMemo(() => {
    return appontiments.find(appointment => 
      isAfter(parseISO(appointment.date), new Date())
    )
  }, [appontiments])

  useEffect(() => {
    api.get(`/provider/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      }
    }).then(response => {
      setMonthAvailability(response.data)
    })
  }, [currentMonth, user.id])

  useEffect(() => {
    api.get<Appointiment[]>('/appointment/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then(response => {
      const appointimentsFormmated = response.data.map((appointment => {
        return {
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm') 
        }
      }))
      setAppontiments(appointimentsFormmated)
    })
  }, [selectedDate])

 

  return (
  <Container>
    {console.log(appontiments)}
    <Header>
      <HeaderContent>
        <img src={logoImg} alt="Go"/>
        <Profile>
          <img 
            src={user.avatar_url} 
            alt="Profile"
          />
          <div>
            <span>Bem vindo, </span>
            <strong>{user.name}</strong>
          </div>
        </Profile>

        <button type="button" onClick={signOut}>
          <FiPower  />
        </button>
      </HeaderContent>
    </Header>

    <Content>
      <Schedule>
        <h1>Horários agendados</h1>
        <p>
          {isToday(selectedDate) && <span>Hoje</span>}
          <span>{selectDateAsText}</span>
          <span>{selectWeekDay}</span>
        </p>

        { nextAppointment && (
          <NextAppointment>
            <strong>Agendamento a seguir</strong>
            <div>
              <img src={nextAppointment.user.avatar_url} alt={nextAppointment.user.name}/>
              <strong>{nextAppointment.user.name}</strong>
              <span>
                <FiClock />
                {nextAppointment.hourFormatted}
              </span>
            </div>
          </NextAppointment>
        )}


        <Section>
          <strong>Manhã</strong>
          {morningAppointments.length === 0 && (
            <p>Nenhum agendamento encontrado</p>
          )}
          {morningAppointments.map(appointment => (

            <Appontiment key={appointment.id}>
              <span>
                <FiClock />
                {appointment.hourFormatted}
              </span>
              <div>
              <img src={appointment.user.avatar_url} alt={appointment.user.name} />
              <strong>{appointment.user.name}</strong>
              </div>
            </Appontiment>
          ))}

        </Section>

        <Section>
          <strong>Tarde</strong>
          {afternoonAppointments.length === 0 && (
            <p>Nenhum agendamento encontrado</p>
          )}
          {afternoonAppointments.map(appointment => (

            <Appontiment key={appointment.id}>
              <span>
                <FiClock />
                {appointment.hourFormatted}
              </span>
              <div>
              <img src={appointment.user.avatar_url} alt={appointment.user.name} />
              <strong>{appointment.user.name}</strong>
              </div>
            </Appontiment>
            ))}

        </Section>
      </Schedule>
      <Calendar>
        <DayPicker 
          weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
          fromMonth={new Date()}
          disabledDays={[
            { daysOfWeek: [0, 6] },
            ...disabledDays
          ]}
          selectedDays={selectedDate}
          modifiers={{
            available: { daysOfWeek: [1, 2, 3, 4, 5] }
          }}
          onMonthChange={handleMonthChange}
          onDayClick={handleDayChange}
          months={[
            'Janiero',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
          ]}
        />
      </Calendar>
    </Content>
  </Container>
  );
}

export default Dashboard;