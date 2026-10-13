/**
 * Quantiva - Product Page Interactive Modules
 * Color Palette: #010736, #0D1C42, #22396F, #FCF1D0
 */

document.addEventListener('DOMContentLoaded', () => {
  initWorkflowNodes();
  initHorizonSelector();
  initConfidenceBandToggle();
  initOptimizationConstraintSlider();
  initProductScenarioComparison();
  initDataTableFilter();
});

/* ==========================================================================
   Workflow Interactive Nodes
   ========================================================================== */
function initWorkflowNodes() {
  const nodes = document.querySelectorAll('.workflow-node');
  const detailsTitle = document.getElementById('workflowActiveTitle');
  const detailsDesc = document.getElementById('workflowActiveDesc');
  const detailsStat = document.getElementById('workflowActiveStat');

  const workflowInfo = [
    {
      title: '1. Datasets & Variables',
      desc: 'Ingest financial, energy, and supply chain time-series data with schema validation, missing value imputation, and automated variable classification.',
      stat: 'Schema Validated: 100% | Ingestion Latency: <1.4s'
    },
    {
      title: '2. Forecasting Projects',
      desc: 'Configure statistical models, deep learning architectures, and ensemble regressors. Define target metrics, horizons, and exogenous indicators.',
      stat: 'Model Ensemble: 8 Backends | GPU Accelerated: CUDA 12+'
    },
    {
      title: '3. Forecast Results & Analysis',
      desc: 'Evaluate projected demand, cash flow, or power load curves alongside historical ground truth with rigorous confidence intervals and MAPE scoring.',
      stat: 'Mean Abs Error: 3.2% | Confidence Interval: 95%'
    },
    {
      title: '4. Optimization Scenarios',
      desc: 'Formulate multivariable objective functions with real-world capital, throughput, tariff, and lead-time constraints.',
      stat: 'Solver: Mixed-Integer Quadratic | Convergence: 420ms'
    },
    {
      title: '5. Scenario Comparison & History',
      desc: 'Audit scenario outputs side-by-side, inspect decision trade-offs, and maintain permanent lineage records for executive governance.',
      stat: 'Full Lineage Retained | Zero Spreadsheet Drifts'
    }
  ];

  if (!nodes.length) return;

  nodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const info = workflowInfo[index];
      if (info && detailsTitle && detailsDesc && detailsStat) {
        detailsTitle.textContent = info.title;
        detailsDesc.textContent = info.desc;
        detailsStat.textContent = info.stat;
      }
    });
  });
}

/* ==========================================================================
   Interactive Forecast Horizon Selector
   ========================================================================== */
function initHorizonSelector() {
  const horizonBtns = document.querySelectorAll('.horizon-btn');
  const horizonMetric = document.getElementById('horizonValue');
  const horizonMape = document.getElementById('horizonMape');

  const horizonMetrics = {
    '3M': { value: '$34.2M ± 1.8%', mape: '2.1%' },
    '6M': { value: '$48.6M ± 2.4%', mape: '2.7%' },
    '12M': { value: '$72.1M ± 3.8%', mape: '3.2%' },
    '24M': { value: '$114.5M ± 5.2%', mape: '4.6%' }
  };

  horizonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      horizonBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const h = btn.getAttribute('data-horizon');
      const data = horizonMetrics[h];
      if (data && horizonMetric && horizonMape) {
        horizonMetric.textContent = data.value;
        horizonMape.textContent = data.mape;
      }
    });
  });
}

/* ==========================================================================
   Confidence Band Toggle
   ========================================================================== */
function initConfidenceBandToggle() {
  const confBtns = document.querySelectorAll('.conf-toggle-btn');
  const bandPolygon = document.getElementById('forecastBandPolygon');
  const confLabel = document.getElementById('confLevelLabel');

  const bandPoints = {
    '80': 'M 280,105 Q 350,90 420,70 Q 500,55 580,45 L 580,115 Q 500,125 420,135 Q 350,130 280,120 Z',
    '90': 'M 280,100 Q 350,80 420,55 Q 500,38 580,25 L 580,135 Q 500,142 420,150 Q 350,140 280,120 Z',
    '95': 'M 280,95 Q 350,70 420,40 Q 500,20 580,10 L 580,155 Q 500,165 420,170 Q 350,150 280,120 Z'
  };

  confBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      confBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const level = btn.getAttribute('data-conf');
      if (bandPolygon && bandPoints[level]) {
        bandPolygon.setAttribute('d', bandPoints[level]);
      }
      if (confLabel) {
        confLabel.textContent = `${level}% Confidence Envelope`;
      }
    });
  });
}

/* ==========================================================================
   Optimization Interactive Constraint Slider
   ========================================================================== */
function initOptimizationConstraintSlider() {
  const slider = document.getElementById('budgetConstraintSlider');
  const sliderVal = document.getElementById('budgetSliderVal');
  const barInventory = document.getElementById('optBarInventory');
  const barLogistics = document.getElementById('optBarLogistics');
  const barProduction = document.getElementById('optBarProduction');
  const barReserve = document.getElementById('optBarReserve');

  if (!slider) return;

  const updateAllocation = () => {
    const val = parseInt(slider.value, 10);
    if (sliderVal) {
      sliderVal.textContent = `$${(val / 1000).toFixed(1)}M`;
    }

    // Mathematical distribution proportional to constraint
    const inventoryPct = Math.min(100, Math.round(20 + (val / 50)));
    const logisticsPct = Math.min(100, Math.round(15 + (val / 75)));
    const productionPct = Math.min(100, Math.round(30 + (val / 60)));
    const reservePct = Math.max(10, Math.round(90 - (val / 40)));

    if (barInventory) {
      barInventory.style.width = `${inventoryPct}%`;
      barInventory.setAttribute('data-val', `${inventoryPct}%`);
      const txt = barInventory.closest('.bar-metric-row')?.querySelector('.bar-pct');
      if (txt) txt.textContent = `${inventoryPct}%`;
    }
    if (barLogistics) {
      barLogistics.style.width = `${logisticsPct}%`;
      const txt = barLogistics.closest('.bar-metric-row')?.querySelector('.bar-pct');
      if (txt) txt.textContent = `${logisticsPct}%`;
    }
    if (barProduction) {
      barProduction.style.width = `${productionPct}%`;
      const txt = barProduction.closest('.bar-metric-row')?.querySelector('.bar-pct');
      if (txt) txt.textContent = `${productionPct}%`;
    }
    if (barReserve) {
      barReserve.style.width = `${reservePct}%`;
      const txt = barReserve.closest('.bar-metric-row')?.querySelector('.bar-pct');
      if (txt) txt.textContent = `${reservePct}%`;
    }
  };

  slider.addEventListener('input', updateAllocation);
  updateAllocation();
}

/* ==========================================================================
   Product Scenario Comparison Side-by-Side Toggle
   ========================================================================== */
function initProductScenarioComparison() {
  const btns = document.querySelectorAll('.prod-sc-btn');
  const roiVal = document.getElementById('prodRoiVal');
  const fillVal = document.getElementById('prodFillVal');
  const costVal = document.getElementById('prodCostVal');

  const prodScenarios = {
    'A': { roi: '24.2%', fill: '91.5%', cost: '$8.4M' },
    'B': { roi: '36.8%', fill: '98.2%', cost: '$12.1M' },
    'C': { roi: '29.4%', fill: '95.1%', cost: '$6.9M' }
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sc = btn.getAttribute('data-sc');
      const data = prodScenarios[sc];
      if (data && roiVal && fillVal && costVal) {
        roiVal.textContent = data.roi;
        fillVal.textContent = data.fill;
        costVal.textContent = data.cost;
      }
    });
  });
}

/* ==========================================================================
   Dataset Table Filter
   ========================================================================== */
function initDataTableFilter() {
  const filterBtns = document.querySelectorAll('.data-filter-btn');
  const tableRows = document.querySelectorAll('.data-sample-row');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      tableRows.forEach(row => {
        if (filter === 'all' || row.getAttribute('data-type') === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}
