import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PatientList } from '../pages/PatientList'
import { NewPatient } from '../pages/NewPatient'
import { Editor } from '../pages/Editor'
import { PcQr } from '../pages/PcQr'
import { PcSession } from '../pages/PcSession'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/evolucoes" replace />} />
        <Route path="/evolucoes" element={<PatientList />} />
        <Route path="/evolucoes/novo" element={<NewPatient />} />
        <Route path="/evolucoes/:id" element={<Editor />} />
        <Route path="/bedside-pc" element={<PcQr />} />
        <Route path="/bedside-pc/sessao" element={<PcSession />} />
      </Routes>
    </BrowserRouter>
  )
}
