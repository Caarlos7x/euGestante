import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaPills, FaPlus, FaTrash, FaBell, FaBellSlash } from 'react-icons/fa';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { medicationService, Medication } from '@/services/medicationService';
import { requestNotificationPermission, isNotificationEnabled, scheduleNotification, cancelScheduledNotification } from '@/utils/notifications';

interface LocalMedication {
  id: string;
  name: string;
  times: string[];
  active: boolean;
  notes?: string;
}

const MedicationCardContainer = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.normal},
    box-shadow ${({ theme }) => theme.transitions.normal};
  position: relative;
  min-height: 12rem; /* 144px */

  &:hover {
    transform: translateY(-0.25rem); /* -3px */
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CardIcon = styled.div`
  font-size: 3rem; /* 36px */
  color: ${({ theme }) => theme.colors.primary.main};
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const MedicationList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-height: 20rem; /* 240px */
  overflow-y: auto;
`;

const MedicationItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 0.083rem solid ${({ theme }) => theme.colors.border.medium};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MedicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MedicationName = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  flex: 1;
`;

const MedicationStatus = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $active, theme }) => ($active ? theme.colors.success.main : theme.colors.text.secondary)};
`;

const MedicationTimes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TimeBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary.light};
  color: ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const MedicationActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs};
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.error.main};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    opacity: 0.7;
    background-color: ${({ theme }) => theme.colors.background.default};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TimeInputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-end;
`;

const TimeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const TimeTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary.light};
  color: ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RemoveTimeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.error.main};
  padding: 0;
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};

  &:hover {
    opacity: 0.7;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NotificationWarning = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.warning.light};
  color: ${({ theme }) => theme.colors.warning.dark};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

export const MedicationCard: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medications, setMedications] = useState<LocalMedication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);
  
  // Estados para novo medicamento
  const [newMedicationName, setNewMedicationName] = useState('');
  const [newMedicationTime, setNewMedicationTime] = useState('');
  const [newMedicationTimes, setNewMedicationTimes] = useState<string[]>([]);
  const [newMedicationNotes, setNewMedicationNotes] = useState('');
  const [editingMedication, setEditingMedication] = useState<LocalMedication | null>(null);
  
  // Refs para armazenar os timeouts das notificações
  const notificationTimeoutsRef = useRef<Map<string, number>>(new Map());

  // Carregar medicamentos
  useEffect(() => {
    if (user) {
      loadMedications();
      checkNotificationPermission();
    }
  }, [user]);

  // Agendar notificações para medicamentos ativos
  useEffect(() => {
    if (notificationPermission && medications.length > 0) {
      // Limpar notificações antigas antes de reagendar
      notificationTimeoutsRef.current.forEach((timeoutId, key) => {
        const tag = key.split('-').slice(1).join('-'); // Extrair tag do key
        cancelScheduledNotification(timeoutId, tag);
      });
      notificationTimeoutsRef.current.clear();
      
      scheduleAllNotifications();
      
      // Reagendar notificações a cada minuto para garantir que não percamos nenhuma
      const intervalId = setInterval(() => {
        scheduleAllNotifications();
      }, 60000); // A cada 1 minuto

      return () => {
        clearInterval(intervalId);
        // Limpar todas as notificações agendadas ao desmontar
        notificationTimeoutsRef.current.forEach((timeoutId, key) => {
          const tag = key.split('-').slice(1).join('-'); // Extrair tag do key
          cancelScheduledNotification(timeoutId, tag);
        });
        notificationTimeoutsRef.current.clear();
      };
    }
  }, [medications, notificationPermission]);

  const checkNotificationPermission = async () => {
    const enabled = isNotificationEnabled();
    setNotificationPermission(enabled);
    
    if (!enabled && 'Notification' in window) {
      // Tentar solicitar permissão automaticamente
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission.granted);
    }
  };

  const loadMedications = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await medicationService.getUserMedications(user.uid);
      setMedications(data.map((med) => ({
        id: med.id!,
        name: med.name,
        times: med.times,
        active: med.active,
        notes: med.notes,
      })));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar medicamentos');
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleAllNotifications = () => {
    if (!notificationPermission) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    medications
      .filter((med) => med.active)
      .forEach((medication) => {
        medication.times.forEach((timeStr) => {
          const key = `${medication.id}-${timeStr}`;
          
          // Se já existe uma notificação agendada para este horário, não criar outra
          if (notificationTimeoutsRef.current.has(key)) {
            return;
          }

          const [hours, minutes] = timeStr.split(':').map(Number);
          const scheduledTime = new Date(today);
          scheduledTime.setHours(hours, minutes, 0, 0);

          // Se o horário já passou hoje, agendar para amanhã
          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }

          const tag = `medication-${medication.id}-${timeStr}`;
          const timeoutId = scheduleNotification(
            `Hora de tomar: ${medication.name}`,
            scheduledTime,
            {
              body: `Lembrete: ${medication.name} às ${timeStr}${medication.notes ? ` - ${medication.notes}` : ''}`,
              tag,
            }
          );

          if (timeoutId !== null) {
            notificationTimeoutsRef.current.set(key, timeoutId);
            
            // Quando a notificação for exibida, remover da lista para poder reagendar
            setTimeout(() => {
              notificationTimeoutsRef.current.delete(key);
            }, scheduledTime.getTime() - now.getTime() + 1000);
          }
        });
      });
  };

  const handleAddTime = () => {
    if (newMedicationTime && !newMedicationTimes.includes(newMedicationTime)) {
      setNewMedicationTimes([...newMedicationTimes, newMedicationTime].sort());
      setNewMedicationTime('');
    }
  };

  const handleRemoveTime = (time: string) => {
    setNewMedicationTimes(newMedicationTimes.filter((t) => t !== time));
  };

  const handleSaveMedication = async () => {
    if (!user) return;

    if (!newMedicationName.trim()) {
      setError('Digite o nome do medicamento');
      return;
    }

    if (newMedicationTimes.length === 0) {
      setError('Adicione pelo menos um horário');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (editingMedication) {
        await medicationService.updateMedication(editingMedication.id, {
          name: newMedicationName.trim(),
          times: newMedicationTimes,
          active: true,
          notes: newMedicationNotes.trim() || undefined,
        });
      } else {
        await medicationService.saveMedication(user.uid, {
          name: newMedicationName.trim(),
          times: newMedicationTimes,
          active: true,
          notes: newMedicationNotes.trim() || undefined,
        });
      }

      await loadMedications();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar medicamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedication = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este medicamento?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await medicationService.deleteMedication(id);
      await loadMedications();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir medicamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (medication: LocalMedication) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await medicationService.updateMedication(medication.id, {
        active: !medication.active,
      });
      await loadMedications();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar medicamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMedication = (medication: LocalMedication) => {
    setEditingMedication(medication);
    setNewMedicationName(medication.name);
    setNewMedicationTimes([...medication.times]);
    setNewMedicationNotes(medication.notes || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedication(null);
    setNewMedicationName('');
    setNewMedicationTime('');
    setNewMedicationTimes([]);
    setNewMedicationNotes('');
    setError(null);
  };

  const handleRequestNotificationPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission.granted);
    
    if (permission.granted) {
      scheduleAllNotifications();
    }
  };

  return (
    <>
      <MedicationCardContainer onClick={() => setIsModalOpen(true)}>
        <CardContent>
          <CardIcon>
            <FaPills />
          </CardIcon>
          <CardTitle>Medicamentos</CardTitle>
          <CardDescription>
            {medications.length > 0
              ? `${medications.length} medicamento${medications.length > 1 ? 's' : ''} cadastrado${medications.length > 1 ? 's' : ''}`
              : 'Clique para adicionar medicamentos'}
          </CardDescription>
        </CardContent>
      </MedicationCardContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Medicamentos"
        size="lg"
      >
        {!notificationPermission && (
          <NotificationWarning>
            <FaBellSlash style={{ marginRight: '0.5rem' }} />
            Notificações não estão habilitadas. 
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestNotificationPermission}
              style={{ marginLeft: '1rem' }}
            >
              Habilitar Notificações
            </Button>
          </NotificationWarning>
        )}

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fee', color: '#c00', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <FormGroup>
          <Input
            label="Nome do Medicamento"
            type="text"
            placeholder="Ex: Ácido Fólico"
            value={newMedicationName}
            onChange={(value) => setNewMedicationName(value)}
          />

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Horários
            </label>
            <TimeInputGroup>
              <Input
                type="time"
                value={newMedicationTime}
                onChange={(value) => setNewMedicationTime(value)}
                fullWidth={false}
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAddTime}
                disabled={!newMedicationTime || newMedicationTimes.includes(newMedicationTime)}
              >
                <FaPlus /> Adicionar
              </Button>
            </TimeInputGroup>
            {newMedicationTimes.length > 0 && (
              <TimeList>
                {newMedicationTimes.map((time) => (
                  <TimeTag key={time}>
                    {time}
                    <RemoveTimeButton
                      type="button"
                      onClick={() => handleRemoveTime(time)}
                      aria-label={`Remover horário ${time}`}
                    >
                      ×
                    </RemoveTimeButton>
                  </TimeTag>
                ))}
              </TimeList>
            )}
          </div>

          <Input
            label="Observações (opcional)"
            type="text"
            placeholder="Ex: Tomar com água"
            value={newMedicationNotes}
            onChange={(value) => setNewMedicationNotes(value)}
          />

          <Button
            variant="primary"
            onClick={handleSaveMedication}
            disabled={isLoading || !newMedicationName.trim() || newMedicationTimes.length === 0}
            fullWidth
          >
            {isLoading ? 'Salvando...' : editingMedication ? 'Atualizar' : 'Adicionar Medicamento'}
          </Button>
        </FormGroup>

        {medications.length > 0 && (
          <MedicationList>
            {medications.map((medication) => (
              <MedicationItem key={medication.id}>
                <MedicationHeader>
                  <MedicationName>{medication.name}</MedicationName>
                  <MedicationStatus $active={medication.active}>
                    {medication.active ? <FaBell /> : <FaBellSlash />}
                    {medication.active ? 'Ativo' : 'Inativo'}
                  </MedicationStatus>
                </MedicationHeader>
                <MedicationTimes>
                  {medication.times.map((time) => (
                    <TimeBadge key={time}>{time}</TimeBadge>
                  ))}
                </MedicationTimes>
                {medication.notes && (
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                    {medication.notes}
                  </div>
                )}
                <MedicationActions>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(medication)}
                    disabled={isLoading}
                  >
                    {medication.active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditMedication(medication)}
                    disabled={isLoading}
                  >
                    Editar
                  </Button>
                  <ActionButton
                    type="button"
                    onClick={() => handleDeleteMedication(medication.id)}
                    disabled={isLoading}
                    aria-label="Excluir medicamento"
                  >
                    <FaTrash />
                  </ActionButton>
                </MedicationActions>
              </MedicationItem>
            ))}
          </MedicationList>
        )}

        {medications.length === 0 && !isLoading && (
          <EmptyState>
            <p>Nenhum medicamento cadastrado ainda.</p>
            <p>Adicione um medicamento acima para começar.</p>
          </EmptyState>
        )}
      </Modal>
    </>
  );
};
