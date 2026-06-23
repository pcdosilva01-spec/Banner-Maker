// Particles Animation
class ParticlesAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.init();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  init() {
    const particleCount = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 10000));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    this.animate();
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw gradient background
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
    gradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(96, 165, 250, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    // Draw connections
    this.particles.forEach((p1, i) => {
      this.particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(96, 165, 250, ${0.1 * (1 - distance / 150)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles
const particlesCanvas = document.getElementById('particles');
if (particlesCanvas) {
  new ParticlesAnimation(particlesCanvas);
}

// Navigation
const startBtn = document.getElementById('startBtn');
const heroSection = document.getElementById('hero');
const formSection = document.getElementById('formSection');
const dashboardSection = document.getElementById('dashboard');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');

startBtn?.addEventListener('click', () => {
  heroSection.classList.add('hidden');
  formSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

newAnalysisBtn?.addEventListener('click', () => {
  dashboardSection.classList.add('hidden');
  formSection.classList.remove('hidden');
  document.getElementById('financialForm').reset();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form Submission
const financialForm = document.getElementById('financialForm');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

financialForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    renda: parseFloat(document.getElementById('renda').value),
    gastos: parseFloat(document.getElementById('gastos').value),
    reserva: parseFloat(document.getElementById('reserva').value),
    dividas: parseFloat(document.getElementById('dividas').value),
    dependentes: parseInt(document.getElementById('dependentes').value) || 0,
    objetivos: document.getElementById('objetivos').value
  };
  
  // Show loading
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  
  try {
    const response = await fetch('/api/diagnostic/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayDashboard(data);
      formSection.classList.add('hidden');
      dashboardSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Erro ao processar análise: ' + data.error);
    }
  } catch (error) {
    alert('Erro de conexão. Verifique se o servidor está rodando.');
    console.error(error);
  } finally {
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
});

// Display Dashboard
function displayDashboard(data) {
  // Animate score
  animateScore(data.score);
  
  // Update score badge
  const scoreBadge = document.getElementById('scoreBadge');
  if (data.score >= 80) {
    scoreBadge.textContent = '⭐ Excelente';
    scoreBadge.style.background = 'rgba(34, 197, 94, 0.2)';
    scoreBadge.style.borderColor = 'rgba(34, 197, 94, 0.5)';
    scoreBadge.style.color = '#22C55E';
  } else if (data.score >= 60) {
    scoreBadge.textContent = '👍 Bom';
    scoreBadge.style.background = 'rgba(59, 130, 246, 0.2)';
    scoreBadge.style.borderColor = 'rgba(59, 130, 246, 0.5)';
    scoreBadge.style.color = '#3B82F6';
  } else if (data.score >= 40) {
    scoreBadge.textContent = '⚠️ Regular';
    scoreBadge.style.background = 'rgba(245, 158, 11, 0.2)';
    scoreBadge.style.borderColor = 'rgba(245, 158, 11, 0.5)';
    scoreBadge.style.color = '#F59E0B';
  } else {
    scoreBadge.textContent = '🚨 Atenção';
    scoreBadge.style.background = 'rgba(239, 68, 68, 0.2)';
    scoreBadge.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    scoreBadge.style.color = '#EF4444';
  }
  
  // Update metrics
  document.getElementById('metricSaldo').textContent = 
    `R$ ${data.metrics.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  document.getElementById('metricReserva').textContent = 
    `${data.metrics.taxaReserva}%`;
  document.getElementById('metricDivida').textContent = 
    `${data.metrics.taxaDivida}%`;
  document.getElementById('metricEconomia').textContent = 
    `${data.metrics.capacidadeEconomia}%`;
  
  // Display AI analysis
  const analysisContent = document.getElementById('aiAnalysis');
  
  // Limpar e formatar a resposta da IA
  const formattedAnalysis = data.analysis
    .replace(/\*\*/g, '') // Remove negrito markdown
    .replace(/###/g, '') // Remove headers
    .replace(/\|/g, '') // Remove tabelas
    .replace(/---/g, '') // Remove separadores
    .replace(/\*/g, '•') // Substitui * por bullet
    .split('\n')
    .filter(line => line.trim().length > 0) // Remove linhas vazias
    .map(line => {
      const trimmed = line.trim();
      // Identifica títulos (linhas curtas em caps ou começando com número)
      if (trimmed.length < 50 && (trimmed === trimmed.toUpperCase() || /^\d+\./.test(trimmed))) {
        return `<h4 style="color: #60A5FA; margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1rem;">${trimmed}</h4>`;
      }
      // Identifica listas
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        return `<li style="margin-left: 1.5rem; margin-bottom: 0.5rem;">${trimmed.substring(1).trim()}</li>`;
      }
      // Parágrafos normais
      return `<p style="margin-bottom: 1rem; line-height: 1.6;">${trimmed}</p>`;
    })
    .join('');
  
  analysisContent.innerHTML = formattedAnalysis;
  
  // Create charts
  createCharts(data);
}

// Animate Score Gauge
function animateScore(targetScore) {
  const scoreValue = document.getElementById('scoreValue');
  const scoreLabel = document.getElementById('scoreLabel');
  const gaugeFill = document.getElementById('gaugeFill');
  
  let currentScore = 0;
  const duration = 2000;
  const steps = 60;
  const increment = targetScore / steps;
  const stepDuration = duration / steps;
  
  const interval = setInterval(() => {
    currentScore += increment;
    
    if (currentScore >= targetScore) {
      currentScore = targetScore;
      clearInterval(interval);
    }
    
    scoreValue.textContent = Math.round(currentScore);
    
    // Update gauge (SVG path from 0 to 180 degrees)
    const percentage = currentScore / 100;
    const dashArray = `${percentage * 251.2} 251.2`;
    gaugeFill.style.strokeDasharray = dashArray;
    
    // Update label
    if (currentScore >= 80) {
      scoreLabel.textContent = 'Excelente';
      gaugeFill.style.stroke = '#22C55E';
    } else if (currentScore >= 60) {
      scoreLabel.textContent = 'Bom';
      gaugeFill.style.stroke = '#3B82F6';
    } else if (currentScore >= 40) {
      scoreLabel.textContent = 'Regular';
      gaugeFill.style.stroke = '#F59E0B';
    } else {
      scoreLabel.textContent = 'Precisa Melhorar';
      gaugeFill.style.stroke = '#EF4444';
    }
  }, stepDuration);
}

// Create Charts
function createCharts(data) {
  const chartConfig = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#94A3B8',
          font: { family: 'Inter', size: 12 }
        }
      }
    }
  };
  
  // Doughnut Chart
  const doughnutCtx = document.getElementById('doughnutChart');
  if (doughnutCtx) {
    new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Gastos', 'Economia', 'Dívidas', 'Reserva'],
        datasets: [{
          data: [
            data.metrics.saldo < 0 ? Math.abs(data.metrics.saldo) : 0,
            data.metrics.capacidadeEconomia,
            data.metrics.taxaDivida,
            data.metrics.taxaReserva
          ],
          backgroundColor: [
            '#EF4444',
            '#22C55E',
            '#F59E0B',
            '#3B82F6'
          ],
          borderWidth: 0
        }]
      },
      options: {
        ...chartConfig,
        cutout: '70%'
      }
    });
  }
  
  // Radar Chart
  const radarCtx = document.getElementById('radarChart');
  if (radarCtx) {
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Controle', 'Planejamento', 'Reserva', 'Dívidas', 'Economia'],
        datasets: [{
          label: 'Saúde Financeira',
          data: [
            data.metrics.saldo > 0 ? 80 : 40,
            data.metrics.capacidadeEconomia,
            Math.min(data.metrics.taxaReserva, 100),
            Math.max(0, 100 - data.metrics.taxaDivida),
            data.metrics.capacidadeEconomia
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          pointBackgroundColor: '#3B82F6'
        }]
      },
      options: {
        ...chartConfig,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#94A3B8', backdropColor: 'transparent' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            pointLabels: { color: '#94A3B8', font: { size: 11 } }
          }
        }
      }
    });
  }
}

export { animateScore, displayDashboard };

// Import chat module
import './chat.js';

// Quick Select Buttons
document.querySelectorAll('.quick-btn, .quick-btn-text').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = btn.dataset.target;
    const value = btn.dataset.value;
    const input = document.getElementById(target);
    
    if (input) {
      if (input.tagName === 'TEXTAREA') {
        input.value = value;
      } else {
        input.value = value;
      }
      
      // Remove active from siblings
      btn.parentElement.querySelectorAll('.quick-btn, .quick-btn-text').forEach(b => {
        b.classList.remove('active');
      });
      
      // Add active to clicked button
      btn.classList.add('active');
      
      // Trigger input event for validation
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
});

// Input validation and formatting
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('input', () => {
    // Remove active state from quick buttons when user types
    const targetName = input.id;
    const quickButtons = document.querySelectorAll(`[data-target="${targetName}"]`);
    quickButtons.forEach(btn => btn.classList.remove('active'));
  });
});
