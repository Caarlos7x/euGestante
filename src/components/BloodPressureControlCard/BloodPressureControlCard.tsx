import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import { FaStethoscope, FaDownload } from 'react-icons/fa';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Tooltip } from '@/components/Tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { bloodPressureService } from '@/services/bloodPressureService';

// Interface local para o componente (sem userId, será adicionado no serviço)
interface LocalBloodPressureRecord {
  id: string;
  date: string;
  pressure: string;
}

const BloodPressureCardContainer = styled(Card)`
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

const TableContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: visible;
`;

const Table = styled.table`
  width: 100%;
  max-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  table-layout: fixed;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    table-layout: auto;
  }
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.background.light};
`;

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  text-align: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  border-bottom: 0.083rem solid ${({ theme }) => theme.colors.border.medium}; /* 1px */
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  letter-spacing: 0.02em;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  border-bottom: 0.083rem solid ${({ theme }) => theme.colors.border.light}; /* 1px */
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  vertical-align: middle;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const PressureInputWrapper = styled.div`
  width: 100%;
  max-width: 8rem; /* 96px */
  margin: 0 auto;
  position: relative;
  
  input {
    width: 100%;
    height: 3rem; /* 36px - mesma altura do botão sm */
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.paper};
    border: 0.083rem solid ${({ theme }) => theme.colors.border.medium}; /* 1px */
    border-radius: ${({ theme }) => theme.borderRadius.md};
    transition: all ${({ theme }) => theme.transitions.normal};
    text-align: center;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.hint};
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary.main};
      box-shadow: 0 0 0 0.125rem ${({ theme }) => `${theme.colors.primary.main}40`},
                  0 2px 4px 0 rgba(0, 0, 0, 0.1);
      outline: none;
      background-color: ${({ theme }) => theme.colors.background.paper};
    }

    &:hover:not(:focus) {
      border-color: ${({ theme }) => theme.colors.border.dark};
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      padding: ${({ theme }) => theme.spacing.xs};
      max-width: 7rem; /* 84px */
      height: 3rem; /* 36px - manter altura consistente */
    }
  }
`;

const DateCell = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
`;

const DateInputWrapper = styled.div`
  width: 100%;
  max-width: 9rem; /* 108px - ajustado para não invadir outros campos */
  margin: 0 auto;
  
  /* Forçar altura do input para 3rem (36px) - mesma altura do botão sm */
  /* InputContainer > InputWrapper > StyledInput */
  > div {
    width: 100%;
    gap: 0 !important; /* Remover gap do InputContainer */
    
    > div {
      width: 100%;
      
      input {
        height: 3rem !important; /* 36px */
        min-height: 3rem !important;
        padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs} !important;
        font-size: ${({ theme }) => theme.typography.fontSize.xs} !important;
        box-sizing: border-box;
        line-height: 1.5;
        width: 100%;
        max-width: 100%;
      }
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 8rem; /* 96px em mobile */
    
    > div > div input {
      font-size: ${({ theme }) => theme.typography.fontSize.xs} !important;
      padding: ${({ theme }) => theme.spacing.xs} !important;
    }
  }
`;

const DeleteButton = styled(Button)`
  color: #ef4444 !important;
  
  &:hover {
    color: #dc2626 !important;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const BloodPressureControlCard: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState<LocalBloodPressureRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [newRecord, setNewRecord] = useState<Partial<LocalBloodPressureRecord>>({
    date: new Date().toISOString().split('T')[0],
    pressure: '',
  });

  // Carregar registros do Firestore quando o modal abrir
  useEffect(() => {
    if (isModalOpen && user) {
      loadRecords();
    }
  }, [isModalOpen, user]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const loadRecords = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const firestoreRecords = await bloodPressureService.getUserRecords(user.uid);
      
      // Converter para formato local (remover userId, createdAt, updatedAt)
      const localRecords: LocalBloodPressureRecord[] = firestoreRecords.map((record) => ({
        id: record.id || '',
        date: record.date,
        pressure: record.pressure,
      }));

      setRecords(localRecords);
    } catch (err: any) {
      console.error('Erro ao carregar registros:', err);
      setError(err.message || 'Erro ao carregar registros');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      pressure: '',
    });
  };

  const handleAddRecord = async () => {
    if (!newRecord.date || !user) return;

    try {
      setError(null);
      const recordId = await bloodPressureService.saveRecord(user.uid, {
        date: newRecord.date,
        pressure: newRecord.pressure || '',
      });

      // Adicionar ao estado local
      const newLocalRecord: LocalBloodPressureRecord = {
        id: recordId,
        date: newRecord.date,
        pressure: newRecord.pressure || '',
      };

      setRecords([...records, newLocalRecord]);
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        pressure: '',
      });
    } catch (err: any) {
      console.error('Erro ao salvar registro:', err);
      setError(err.message || 'Erro ao salvar registro');
    }
  };

  const handleEditRecord = (id: string) => {
    const record = records.find((r) => r.id === id);
    if (record) {
      setEditingId(id);
      setNewRecord(record);
    }
  };

  const handleUpdateRecord = async () => {
    if (!editingId || !newRecord.date || !user) return;

    try {
      setError(null);
      await bloodPressureService.updateRecord(editingId, {
        date: newRecord.date,
        pressure: newRecord.pressure || '',
      });

      // Atualizar estado local
      setRecords(
        records.map((r) =>
          r.id === editingId
            ? {
                ...r,
                date: newRecord.date!,
                pressure: newRecord.pressure || '',
              }
            : r
        )
      );
      setEditingId(null);
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        pressure: '',
      });
    } catch (err: any) {
      console.error('Erro ao atualizar registro:', err);
      setError(err.message || 'Erro ao atualizar registro');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!user) return;

    try {
      setError(null);
      await bloodPressureService.deleteRecord(id);
      // Remover do estado local
      setRecords(records.filter((r) => r.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar registro:', err);
      setError(err.message || 'Erro ao deletar registro');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handlePressureChange = (value: string) => {
    // Permitir apenas números e barra (/)
    // Formato esperado: 120/80 ou similar
    const allowedChars = /^[0-9/]*$/;
    
    if (!allowedChars.test(value)) {
      // Mostrar tooltip
      setShowTooltip(true);
      
      // Limpar timeout anterior se existir
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      
      // Esconder tooltip após 3 segundos
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    } else {
      // Esconder tooltip se não houver caracteres inválidos
      setShowTooltip(false);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    }
    
    // Filtrar apenas números e barra
    const filteredValue = value.replace(/[^0-9/]/g, '');
    setNewRecord({ ...newRecord, pressure: filteredValue });
  };

  const handleExportToExcel = () => {
    if (records.length === 0) {
      setError('Não há registros para exportar');
      return;
    }

    try {
      // Preparar dados para Excel
      const excelData = records.map((record) => ({
        'Data': formatDate(record.date),
        'Pressão Arterial (mmHg)': record.pressure || '-',
      }));

      // Criar workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 12 }, // Data
        { wch: 20 }, // Pressão Arterial
      ];
      ws['!cols'] = colWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Controle de Pressão');

      // Gerar nome do arquivo com data atual
      const today = new Date();
      const dateStr = today.toLocaleDateString('pt-BR').replace(/\//g, '-');
      const fileName = `Controle_Pressao_Arterial_${dateStr}.xlsx`;

      // Fazer download
      XLSX.writeFile(wb, fileName);
    } catch (err: any) {
      console.error('Erro ao exportar para Excel:', err);
      setError('Erro ao exportar dados. Tente novamente.');
    }
  };

  return (
    <>
      <BloodPressureCardContainer padding="lg" elevation="sm" onClick={handleOpenModal}>
        <CardContent>
          <CardIcon>
            <FaStethoscope />
          </CardIcon>
          <CardTitle>Controle de Pressão Arterial</CardTitle>
          <CardDescription>
            Registre suas medições de pressão arterial
          </CardDescription>
        </CardContent>
      </BloodPressureCardContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Controle de Pressão Arterial"
        size="lg"
        headerActions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportToExcel}
            disabled={records.length === 0 || loading}
          >
            <FaDownload style={{ marginRight: '0.5rem' }} />
            Baixar Excel
          </Button>
        }
      >
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Data</TableHeaderCell>
                <TableHeaderCell>Pressão</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {loading ? (
                <tr>
                  <TableCell colSpan={3}>
                    <EmptyState>Carregando registros...</EmptyState>
                  </TableCell>
                </tr>
              ) : error ? (
                <tr>
                  <TableCell colSpan={3}>
                    <EmptyState style={{ color: '#ef4444' }}>
                      {error}
                    </EmptyState>
                  </TableCell>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <TableCell colSpan={3}>
                    <EmptyState>
                      Nenhum registro encontrado. Adicione um novo registro abaixo.
                    </EmptyState>
                  </TableCell>
                </tr>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <DateCell>{formatDate(record.date)}</DateCell>
                    </TableCell>
                    <TableCell>{record.pressure || '-'}</TableCell>
                    <TableCell>
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditRecord(record.id)}
                        >
                          Editar
                        </Button>
                        <DeleteButton
                          variant="text"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          Excluir
                        </DeleteButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              <TableRow style={{ backgroundColor: 'rgba(139, 74, 156, 0.04)' }}>
                <TableCell>
                  <DateInputWrapper>
                    <Input
                      type="date"
                      value={newRecord.date || ''}
                      onChange={(value) =>
                        setNewRecord({ ...newRecord, date: value })
                      }
                      fullWidth
                    />
                  </DateInputWrapper>
                </TableCell>
                <TableCell>
                  <Tooltip
                    show={showTooltip}
                    message="Apenas números e barra (/) são permitidos. Exemplo: 120/80"
                    position="top"
                  >
                    <PressureInputWrapper>
                      <input
                        type="text"
                        placeholder="120/80"
                        value={newRecord.pressure || ''}
                        onChange={(e) => handlePressureChange(e.target.value)}
                      />
                    </PressureInputWrapper>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {editingId ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleUpdateRecord}
                    >
                      Salvar
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddRecord}
                    >
                      Adicionar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </>
  );
};
