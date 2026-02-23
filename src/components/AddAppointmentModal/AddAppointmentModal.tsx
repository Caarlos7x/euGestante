import { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { appointmentService, Appointment } from '@/services/appointmentService';
import { useAuth } from '@/contexts/AuthContext';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingAppointment?: Appointment | null;
}

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const TypeSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TypeButton = styled.button<{ $active: boolean; $type: 'exame' | 'consulta' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: 0.166rem solid
    ${({ theme, $active, $type }) =>
      $active
        ? $type === 'exame'
          ? theme.colors.primary.main
          : theme.colors.secondary.main
        : theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $active, $type }) =>
    $active
      ? $type === 'exame'
        ? theme.colors.primary.light
        : theme.colors.secondary.light
      : theme.colors.background.paper};
  color: ${({ theme, $active, $type }) =>
    $active
      ? $type === 'exame'
        ? theme.colors.primary.main
        : theme.colors.secondary.main
      : theme.colors.text.secondary};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.regular};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg}; /* Aumentar padding em mobile */
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }

  &:hover {
    border-color: ${({ theme, $type }) =>
      $type === 'exame' ? theme.colors.primary.main : theme.colors.secondary.main};
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error.light};
  color: ${({ theme }) => theme.colors.error.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingAppointment,
}) => {
  const { user } = useAuth();
  const [type, setType] = useState<'exame' | 'consulta'>(editingAppointment?.type || 'exame');
  const [title, setTitle] = useState(editingAppointment?.title || '');
  const [date, setDate] = useState(editingAppointment?.date || '');
  const [time, setTime] = useState(editingAppointment?.time || '');
  const [doctor, setDoctor] = useState(editingAppointment?.doctor || '');
  const [doctorSpecialty, setDoctorSpecialty] = useState(editingAppointment?.doctorSpecialty || '');
  const [hospitalName, setHospitalName] = useState(editingAppointment?.hospitalName || '');
  const [address, setAddress] = useState(editingAppointment?.address || '');
  const [notes, setNotes] = useState(editingAppointment?.notes || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    // Se não tiver nome do hospital, tentar extrair do endereço
    if (!hospitalName && selectedAddress) {
      const parts = selectedAddress.split(',');
      if (parts.length > 0) {
        setHospitalName(parts[0].trim());
      }
    }
  };

  const handlePlaceDetails = (details: { formatted_address: string; name?: string }) => {
    if (details.name) {
      setHospitalName(details.name);
    }
    if (details.formatted_address) {
      setAddress(details.formatted_address);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    if (!title.trim()) {
      setError('Digite o título do exame/consulta');
      return;
    }

    if (!date) {
      setError('Selecione a data');
      return;
    }

    if (!time) {
      setError('Selecione o horário');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const appointmentData = {
        title: title.trim(),
        date,
        time,
        type,
        doctor: doctor.trim() || undefined,
        doctorSpecialty: doctorSpecialty.trim() || undefined,
        hospitalName: hospitalName.trim() || undefined,
        address: address.trim() || undefined,
        location: hospitalName.trim() || address.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      if (editingAppointment?.id) {
        await appointmentService.updateAppointment(editingAppointment.id, appointmentData);
      } else {
        await appointmentService.saveAppointment(user.uid, appointmentData);
      }

      // Limpar formulário
      setTitle('');
      setDate('');
      setTime('');
      setDoctor('');
      setDoctorSpecialty('');
      setHospitalName('');
      setAddress('');
      setNotes('');
      setType('exame');

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar exame/consulta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      if (!editingAppointment) {
        // Limpar formulário apenas se não estiver editando
        setTitle('');
        setDate('');
        setTime('');
        setDoctor('');
        setDoctorSpecialty('');
        setHospitalName('');
        setAddress('');
        setNotes('');
        setType('exame');
      }
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingAppointment ? 'Editar Exame/Consulta' : 'Adicionar Exame/Consulta'}
      size="lg"
    >
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FormGroup>
        <TypeSelector>
          <TypeButton
            type="button"
            $active={type === 'exame'}
            $type="exame"
            onClick={() => setType('exame')}
          >
            Exame
          </TypeButton>
          <TypeButton
            type="button"
            $active={type === 'consulta'}
            $type="consulta"
            onClick={() => setType('consulta')}
          >
            Consulta
          </TypeButton>
        </TypeSelector>

        <Input
          label="Título"
          type="text"
          placeholder={`Ex: ${type === 'exame' ? 'Ultrassom Obstétrico' : 'Consulta Pré-natal'}`}
          value={title}
          onChange={setTitle}
          error={error && !title.trim() ? 'Campo obrigatório' : null}
          required
        />

        <Row>
          <Input
            label="Data"
            type="date"
            value={date}
            onChange={setDate}
            error={error && !date ? 'Campo obrigatório' : null}
            required
          />
          <Input
            label="Horário"
            type="time"
            value={time}
            onChange={setTime}
            error={error && !time ? 'Campo obrigatório' : null}
            required
          />
        </Row>

        <Row>
          <Input
            label="Nome do Médico (opcional)"
            type="text"
            placeholder="Ex: Dr. Carlos Silva"
            value={doctor}
            onChange={setDoctor}
          />
          <Input
            label="Especialidade (opcional)"
            type="text"
            placeholder="Ex: Obstetra, Cardiologista"
            value={doctorSpecialty}
            onChange={setDoctorSpecialty}
          />
        </Row>

        <Input
          label="Nome do Hospital/Clínica (opcional)"
          type="text"
          placeholder="Ex: Hospital São Paulo"
          value={hospitalName}
          onChange={setHospitalName}
        />

        <AddressAutocomplete
          label="Endereço"
          placeholder="Digite o endereço ou nome do local"
          value={address}
          onChange={handleAddressSelect}
          onPlaceSelect={handlePlaceDetails}
          error={null}
        />

        <Input
          label="Observações (opcional)"
          type="text"
          placeholder="Informações adicionais"
          value={notes}
          onChange={setNotes}
        />

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || !title.trim() || !date || !time}
          fullWidth
        >
          {isLoading ? 'Salvando...' : editingAppointment ? 'Atualizar' : 'Adicionar'}
        </Button>
      </FormGroup>
    </Modal>
  );
};
