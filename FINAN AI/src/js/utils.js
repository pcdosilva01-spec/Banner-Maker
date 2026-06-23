// Utility Functions

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatPercentage(value) {
  return `${value.toFixed(1)}%`;
}

export function validateFinancialData(data) {
  const errors = [];
  
  if (data.renda <= 0) {
    errors.push('Renda deve ser maior que zero');
  }
  
  if (data.gastos < 0) {
    errors.push('Gastos não podem ser negativos');
  }
  
  if (data.reserva < 0) {
    errors.push('Reserva não pode ser negativa');
  }
  
  if (data.dividas < 0) {
    errors.push('Dívidas não podem ser negativas');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function calculateFinancialHealth(data) {
  const saldo = data.renda - data.gastos;
  const taxaReserva = (data.reserva / (data.renda * 6)) * 100;
  const taxaDivida = data.renda > 0 ? (data.dividas / data.renda) * 100 : 0;
  const capacidadeEconomia = data.renda > 0 ? (saldo / data.renda) * 100 : 0;
  
  return {
    saldo,
    taxaReserva: Math.min(taxaReserva, 100),
    taxaDivida,
    capacidadeEconomia: Math.max(0, capacidadeEconomia)
  };
}

export function getScoreColor(score) {
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#3B82F6';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}

export function getScoreLabel(score) {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bom';
  if (score >= 40) return 'Regular';
  return 'Precisa Melhorar';
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
