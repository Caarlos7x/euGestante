import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import { FaChartLine, FaDownload } from 'react-icons/fa';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Tooltip } from '@/components/Tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { dextroService } from '@/services/dextroService';

// Interface local para o componente (sem userId, será adicionado no serviço)
interface LocalDextroRecord {
  id: string;
  date: string;
  jejum: string;
  umaHoraPosAlmoco: string;
  preAlmoco: string;
  umaHoraPosAlmoco2: string;
  preJantar: string;
  umaHoraPosJantar: string;
}

const DextroCardContainer = styled(Card)`
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

const InputCellWrapper = styled.div`
  width: 100%;
  max-width: 4.5rem; /* 54px */
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

    /* Remove spinners */
    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      padding: ${({ theme }) => theme.spacing.xs};
      max-width: 3.5rem; /* 42px */
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

export const DextroControlCard: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState<LocalDextroRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipField, setTooltipField] = useState<string | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [newRecord, setNewRecord] = useState<Partial<LocalDextroRecord>>({
    date: new Date().toISOString().split('T')[0],
    jejum: '',
    umaHoraPosAlmoco: '',
    preAlmoco: '',
    umaHoraPosAlmoco2: '',
    preJantar: '',
    umaHoraPosJantar: '',
  });

  // Carregar registros do Firestore quando o modal abrir
  useEffect(() => {
    if (isModalOpen && user) {
      loadRecords();
    }
  }, [isModalOpen, user]);

  const loadRecords = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const firestoreRecords = await dextroService.getUserRecords(user.uid);
      
      // Converter para formato local (remover userId, createdAt, updatedAt)
      const localRecords: LocalDextroRecord[] = firestoreRecords.map((record) => ({
        id: record.id || '',
        date: record.date,
        jejum: record.jejum,
        umaHoraPosAlmoco: record.umaHoraPosAlmoco,
        preAlmoco: record.preAlmoco,
        umaHoraPosAlmoco2: record.umaHoraPosAlmoco2,
        preJantar: record.preJantar,
        umaHoraPosJantar: record.umaHoraPosJantar,
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
      jejum: '',
      umaHoraPosAlmoco: '',
      preAlmoco: '',
      umaHoraPosAlmoco2: '',
      preJantar: '',
      umaHoraPosJantar: '',
    });
  };

  const handleAddRecord = async () => {
    if (!newRecord.date || !user) return;

    try {
      setError(null);
      const recordId = await dextroService.saveRecord(user.uid, {
        date: newRecord.date,
        jejum: newRecord.jejum || '',
        umaHoraPosAlmoco: newRecord.umaHoraPosAlmoco || '',
        preAlmoco: newRecord.preAlmoco || '',
        umaHoraPosAlmoco2: newRecord.umaHoraPosAlmoco2 || '',
        preJantar: newRecord.preJantar || '',
        umaHoraPosJantar: newRecord.umaHoraPosJantar || '',
      });

      // Adicionar ao estado local
      const newLocalRecord: LocalDextroRecord = {
        id: recordId,
        date: newRecord.date,
        jejum: newRecord.jejum || '',
        umaHoraPosAlmoco: newRecord.umaHoraPosAlmoco || '',
        preAlmoco: newRecord.preAlmoco || '',
        umaHoraPosAlmoco2: newRecord.umaHoraPosAlmoco2 || '',
        preJantar: newRecord.preJantar || '',
        umaHoraPosJantar: newRecord.umaHoraPosJantar || '',
      };

      setRecords([...records, newLocalRecord]);
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        jejum: '',
        umaHoraPosAlmoco: '',
        preAlmoco: '',
        umaHoraPosAlmoco2: '',
        preJantar: '',
        umaHoraPosJantar: '',
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
      await dextroService.updateRecord(editingId, {
        date: newRecord.date,
        jejum: newRecord.jejum || '',
        umaHoraPosAlmoco: newRecord.umaHoraPosAlmoco || '',
        preAlmoco: newRecord.preAlmoco || '',
        umaHoraPosAlmoco2: newRecord.umaHoraPosAlmoco2 || '',
        preJantar: newRecord.preJantar || '',
        umaHoraPosJantar: newRecord.umaHoraPosJantar || '',
      });

      // Atualizar estado local
      setRecords(
        records.map((r) =>
          r.id === editingId
            ? {
                ...r,
                date: newRecord.date!,
                jejum: newRecord.jejum || '',
                umaHoraPosAlmoco: newRecord.umaHoraPosAlmoco || '',
                preAlmoco: newRecord.preAlmoco || '',
                umaHoraPosAlmoco2: newRecord.umaHoraPosAlmoco2 || '',
                preJantar: newRecord.preJantar || '',
                umaHoraPosJantar: newRecord.umaHoraPosJantar || '',
              }
            : r
        )
      );
      setEditingId(null);
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        jejum: '',
        umaHoraPosAlmoco: '',
        preAlmoco: '',
        umaHoraPosAlmoco2: '',
        preJantar: '',
        umaHoraPosJantar: '',
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
      await dextroService.deleteRecord(id);
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

  const handleNumericChange = (
    value: string,
    field: keyof Omit<LocalDextroRecord, 'id' | 'date'>
  ) => {
    // Verificar se há letras no valor digitado
    const hasLetters = /[a-zA-Z]/.test(value);
    
    if (hasLetters) {
      // Mostrar tooltip
      setTooltipField(field);
      setShowTooltip(true);
      
      // Limpar timeout anterior se existir
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      
      // Esconder tooltip após 3 segundos
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
        setTooltipField(null);
      }, 3000);
    } else {
      // Esconder tooltip se não houver letras
      setShowTooltip(false);
      setTooltipField(null);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    }
    
    // Remove tudo que não é número
    const numericValue = value.replace(/[^0-9]/g, '');
    setNewRecord({ ...newRecord, [field]: numericValue });
  };

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleExportToExcel = () => {
    if (records.length === 0) {
      setError('Não há registros para exportar');
      return;
    }

    try {
      // Preparar dados para Excel
      const excelData = records.map((record) => ({
        'Dia': formatDate(record.date),
        'Jejum (mg/dL)': record.jejum || '-',
        '1h pós almoço (mg/dL)': record.umaHoraPosAlmoco || '-',
        'Pré almoço (mg/dL)': record.preAlmoco || '-',
        '1h pós almoço 2 (mg/dL)': record.umaHoraPosAlmoco2 || '-',
        'Pré jantar (mg/dL)': record.preJantar || '-',
        '1h pós jantar (mg/dL)': record.umaHoraPosJantar || '-',
      }));

      // Criar workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 12 }, // Dia
        { wch: 15 }, // Jejum
        { wch: 18 }, // 1h pós almoço
        { wch: 16 }, // Pré almoço
        { wch: 18 }, // 1h pós almoço
        { wch: 16 }, // Pré jantar
        { wch: 18 }, // 1h pós jantar
      ];
      ws['!cols'] = colWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Controle de Dextro');

      // Gerar nome do arquivo com data atual
      const today = new Date();
      const dateStr = today.toLocaleDateString('pt-BR').replace(/\//g, '-');
      const fileName = `Controle_Dextro_${dateStr}.xlsx`;

      // Fazer download
      XLSX.writeFile(wb, fileName);
    } catch (err: any) {
      console.error('Erro ao exportar para Excel:', err);
      setError('Erro ao exportar dados. Tente novamente.');
    }
  };

  return (
    <>
      <DextroCardContainer padding="lg" elevation="sm" onClick={handleOpenModal}>
        <CardContent>
          <CardIcon>
            <FaChartLine />
          </CardIcon>
          <CardTitle>Controle de Dextro</CardTitle>
          <CardDescription>
            Registre seus valores de glicemia ao longo do dia
          </CardDescription>
        </CardContent>
      </DextroCardContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Controle de Dextro"
        size="xl"
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
                <TableHeaderCell>Dia</TableHeaderCell>
                <TableHeaderCell>Jejum</TableHeaderCell>
                <TableHeaderCell>1h pós almoço</TableHeaderCell>
                <TableHeaderCell>Pré almoço</TableHeaderCell>
                <TableHeaderCell>1h pós almoço</TableHeaderCell>
                <TableHeaderCell>Pré jantar</TableHeaderCell>
                <TableHeaderCell>1h pós jantar</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {loading ? (
                <tr>
                  <TableCell colSpan={8}>
                    <EmptyState>Carregando registros...</EmptyState>
                  </TableCell>
                </tr>
              ) : error ? (
                <tr>
                  <TableCell colSpan={8}>
                    <EmptyState style={{ color: '#ef4444' }}>
                      {error}
                    </EmptyState>
                  </TableCell>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <TableCell colSpan={8}>
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
                    <TableCell>{record.jejum || '-'}</TableCell>
                    <TableCell>{record.umaHoraPosAlmoco || '-'}</TableCell>
                    <TableCell>{record.preAlmoco || '-'}</TableCell>
                    <TableCell>{record.umaHoraPosAlmoco2 || '-'}</TableCell>
                    <TableCell>{record.preJantar || '-'}</TableCell>
                    <TableCell>{record.umaHoraPosJantar || '-'}</TableCell>
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
                    show={showTooltip && tooltipField === 'jejum'}
                    message="Apenas números são permitidos"
                    position="top"
                  >
                    <InputCellWrapper>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="mg/dL"
                        value={newRecord.jejum || ''}
                        onChange={(e) => handleNumericChange(e.target.value, 'jejum')}
                      />
                    </InputCellWrapper>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    show={showTooltip && tooltipField === 'umaHoraPosAlmoco'}
                    message="Apenas números são permitidos"
                    position="top"
                  >
                    <InputCellWrapper>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="mg/dL"
                        value={newRecord.umaHoraPosAlmoco || ''}
                        onChange={(e) =>
                          handleNumericChange(e.target.value, 'umaHoraPosAlmoco')
                        }
                      />
                    </InputCellWrapper>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    show={showTooltip && tooltipField === 'preAlmoco'}
                    message="Apenas números são permitidos"
                    position="top"
                  >
                    <InputCellWrapper>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="mg/dL"
                        value={newRecord.preAlmoco || ''}
                        onChange={(e) =>
                          handleNumericChange(e.target.value, 'preAlmoco')
                        }
                      />
                    </InputCellWrapper>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    show={showTooltip && tooltipField === 'umaHoraPosAlmoco2'}
                    message="Apenas números são permitidos"
                    position="top"
                  >
                    <InputCellWrapper>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="mg/dL"
                        value={newRecord.umaHoraPosAlmoco2 || ''}
                        onChange={(e) =>
                          handleNumericChange(e.target.value, 'umaHoraPosAlmoco2')
                        }
                      />
                    </InputCellWrapper>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    show={showTooltip && tooltipField === 'preJantar'}
                    message="Apenas números são permitidos"
                    position="top"
                  >
                    <InputCellWrapper>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="mg/dL"
                        value={newRecord.preJantar || ''}
                        onChange={(e) =>
                          handleNumericChange(e.target.value, 'preJantar')
                        }
                      />
                    </InputCellWrapper>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    show={showTooltip && tooltipField === 'umaHoraPosJantar'}
                    message="Apenas números são permitidos"
                    position="top"
                  >
                    <InputCellWrapper>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="mg/dL"
                        value={newRecord.umaHoraPosJantar || ''}
                        onChange={(e) =>
                          handleNumericChange(e.target.value, 'umaHoraPosJantar')
                        }
                      />
                    </InputCellWrapper>
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
