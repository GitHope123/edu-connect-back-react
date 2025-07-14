// src/expertSystem/engine/FuzzyLogicEngine.js

// Función de membresía trapezoidal para Normal [1-4]
function normalMf(x) {
  if (x <= 1) return 0;
  if (x > 1 && x < 3) return (x - 1) / 2;
  if (x >= 3 && x < 4) return (4 - x) / 1;
  return 0;
}

// Función de membresía trapezoidal para Alto [3-6.4]
function altoMf(x) {
  if (x <= 3) return 0;
  if (x > 3 && x < 4) return (x - 3) / 1;
  if (x >= 4 && x <= 6.4) return 1;
  return 0;
}

// Función corregida para detectar casos extremos
function handleExtremeCase(originalResponses = {}) {
  if (!originalResponses || Object.keys(originalResponses).length === 0) {
    return null;
  }

  const responses = Object.values(originalResponses);
  const allNever = responses.every(r => r === 0);
  const allAlways = responses.every(r => r === 6.4);
  
  // Solo considerar extremo si TODAS las respuestas son idénticas en los valores extremos
  if (allNever) {
    return {
      diagnosis: 'Búsqueda Atención',
      confidence: 50,
      isExtremeCase: true,
      extremeType: 'all_never',
      note: 'Todas las respuestas fueron "Nunca". Se recomienda revisar las respuestas.'
    };
  }
  
  if (allAlways) {
    return {
      diagnosis: 'Conducta Dependiente',
      confidence: 50,
      isExtremeCase: true,
      extremeType: 'all_always',
      note: 'Todas las respuestas fueron "Siempre". Se recomienda revisar las respuestas.'
    };
  }
  
  return null;
}

export class FuzzyLogicEngine {
  constructor() {
    // Rangos exactos según la tesis
    this.ranges = {
      minuciosidad: { min: 0, max: 6.4 },
      emocionalidad: { min: 0, max: 6.4 },
      agresividad: { min: 0, max: 6.4 },
      dependiente: { min: 0, max: 6.4 },
      temerosidad: { min: 0, max: 6.4 }
    };

    // Funciones de membresía trapezoidales corregidas
    this.membershipFunctions = {
      minuciosidad: { normal: normalMf, alto: altoMf },
      emocionalidad: { normal: normalMf, alto: altoMf, estable: normalMf, inestable: altoMf },
      agresividad: { normal: normalMf, alto: altoMf },
      dependiente: { normal: normalMf, alto: altoMf },
      temerosidad: { normal: normalMf, alto: altoMf }
    };

    // Configuración de salida según especificación
    this.outputRanges = {
      'Búsqueda Atención': { min: 0, max: 18 },
      'Conducta Dependiente': { min: 16, max: 27 },
      'Inhibición Conductual': { min: 25, max: 32 }
    };

    // Etiquetas de factores para visualización
    this.factorNames = {
      minuciosidad: 'Minuciosidad',
      emocionalidad: 'Emocionalidad',
      agresividad: 'Agresividad',
      dependiente: 'Dependiente',
      temerosidad: 'Temerosidad'
    };

    // Debug: mostrar configuración
    console.log('Configuración de funciones de membresía:', this.membershipFunctions);
  }

  // Validar entradas
  validateInputs(inputs) {
    const required = ['minuciosidad', 'emocionalidad', 'agresividad', 'dependiente', 'temerosidad'];
    for (const factor of required) {
      if (!(factor in inputs)) {
        throw new Error(`Factor requerido faltante: ${factor}`);
      }
      const value = inputs[factor];
      if (typeof value !== 'number' || isNaN(value)) {
        throw new Error(`Valor inválido para ${factor}: ${value}`);
      }
      const range = this.ranges[factor];
      if (value < range.min || value > range.max) {
        throw new Error(`Valor fuera de rango para ${factor}: ${value} (rango: ${range.min}-${range.max})`);
      }
    }
  }

  // Devuelve todos los grados de membresía relevantes para una variable
  getAllMemberships(value, variable) {
    const mfs = this.membershipFunctions[variable];
    const result = {};
    for (const term in mfs) {
      result[term] = Math.max(0, Math.min(1, mfs[term](value)));
    }
    return result;
  }

  // Devuelve el grado de membresía para un término específico
  getMembership(value, variable, term) {
    const mf = this.membershipFunctions[variable]?.[term];
    if (!mf) return 0;
    return Math.max(0, Math.min(1, mf(value)));
  }

  // Evaluar regla difusa con operador AND (mínimo)
  evaluateRule(inputs, rule) {
    let minDegree = 1;
    let debug = [];
    
    for (const [variable, term] of Object.entries(rule.antecedent)) {
      const degree = this.getMembership(inputs[variable], variable, term);
      debug.push(`${variable}.${term}(${inputs[variable]})=${degree.toFixed(2)}`);
      minDegree = Math.min(minDegree, degree);
    }
    
    console.log(`Regla ${rule.id}: ${debug.join(', ')} → ${rule.consequent} (activación: ${minDegree.toFixed(3)})`);
    return minDegree;
  }

  // Defuzzificación: suma activaciones por diagnóstico y selecciona el de mayor score
  defuzzify(activations, rules) {
    if (activations.length === 0) return 'Búsqueda Atención';
    
    // Agrupar activaciones por diagnóstico
    const outputScores = {};
    for (const act of activations) {
      if (!outputScores[act.consequent]) outputScores[act.consequent] = 0;
      outputScores[act.consequent] += act.degree;
    }
    
    // Debug: mostrar scores por diagnóstico
    console.log('Scores por diagnóstico:', Object.entries(outputScores)
      .map(([diag, score]) => `${diag}: ${score.toFixed(3)}`).join(', '));
    
    // Obtener el diagnóstico con mayor activación acumulada
    let bestDiagnosis = null;
    let bestScore = -1;
    
    for (const [diagnosis, score] of Object.entries(outputScores)) {
      if (score > bestScore) {
        bestDiagnosis = diagnosis;
        bestScore = score;
      } else if (score === bestScore) {
        // En caso de empate, prioriza el que tenga más reglas con términos "alto"
        const rulesForDiagnosis = activations
          .filter(a => a.consequent === diagnosis)
          .map(a => rules.find(r => r.id === a.rule_id));
        const altoCount = rulesForDiagnosis.reduce((sum, r) => {
          return sum + Object.values(r.antecedent).filter(t => t === 'alto' || t === 'inestable').length;
        }, 0);
        
        const rulesForBest = activations
          .filter(a => a.consequent === bestDiagnosis)
          .map(a => rules.find(r => r.id === a.rule_id));
        const altoBest = rulesForBest.reduce((sum, r) => {
          return sum + Object.values(r.antecedent).filter(t => t === 'alto' || t === 'inestable').length;
        }, 0);
        
        if (altoCount > altoBest) {
          bestDiagnosis = diagnosis;
          bestScore = score;
        }
      }
    }
    
    console.log(`Diagnóstico seleccionado: ${bestDiagnosis} (score: ${bestScore.toFixed(3)})`);
    return bestDiagnosis;
  }

  // Nivel por factor individual (ajustado según especificación)
  getFactorLevel(value) {
    // Según especificación: Normal [1-4], Alto [3-6.4]
    if (value < 3) return 'Normal';
    if (value <= 4) {
      // Zona de transición - determinar por proximidad
      return value <= 3.5 ? 'Normal' : 'Alto';
    }
    return 'Alto';
  }

  // Cálculo de factores dominantes
  calculateDominantFactors(inputs) {
    return Object.entries(inputs)
      .map(([factor, value]) => ({
        factor: this.factorNames[factor],
        value: Number(value.toFixed(2)),
        level: this.getFactorLevel(value)
      }))
      .sort((a, b) => b.value - a.value);
  }

  // Calcular nivel de confianza del diagnóstico
  calculateConfidence(activations, diagnosis) {
    const diagnosisActivations = activations.filter(a => a.consequent === diagnosis);
    if (diagnosisActivations.length === 0) return 0;
    
    const maxActivation = Math.max(...diagnosisActivations.map(a => a.degree));
    const avgActivation = diagnosisActivations.reduce((sum, a) => sum + a.degree, 0) / diagnosisActivations.length;
    
    return Math.round((maxActivation + avgActivation) / 2 * 100);
  }

  // Método principal del motor difuso
  inference(inputs, rules, originalResponses = {}) {
    try {
      this.validateInputs(inputs);
      
      // Debug: mostrar valores de entrada
      console.log('=== INFERENCIA FUZZY ===');
      console.log('Valores de entrada:', Object.entries(inputs)
        .map(([k, v]) => `${k}: ${v.toFixed(2)}`).join(', '));
      
      // Debug: mostrar membresías
      Object.entries(inputs).forEach(([variable, value]) => {
        const m = this.getAllMemberships(value, variable);
        console.log(`${variable}: ${value} → ${Object.entries(m)
          .filter(([_, v]) => v > 0)
          .map(([k, v]) => `${k}: ${v.toFixed(3)}`).join(', ')}`);
      });
      
      // Verificar casos extremos CORREGIDO
      const extremeCase = handleExtremeCase(originalResponses);
      if (extremeCase) {
        console.log('Caso extremo detectado:', extremeCase.diagnosis);
        return {
          ...extremeCase,
          dominantFactors: this.calculateDominantFactors(inputs),
          activations: []
        };
      }
      
      // Evaluar todas las reglas
      const activations = rules.map(rule => ({
        rule_id: rule.id,
        consequent: rule.consequent,
        degree: this.evaluateRule(inputs, rule)
      })).filter(a => a.degree > 0);
      
      console.log(`Reglas activadas: ${activations.length}/${rules.length}`);
      
      // Seleccionar diagnóstico
      const diagnosis = this.defuzzify(activations, rules);
      const dominantFactors = this.calculateDominantFactors(inputs);
      const confidence = this.calculateConfidence(activations, diagnosis);
      
      console.log(`Resultado final: ${diagnosis} (confianza: ${confidence}%)`);
      console.log('=== FIN INFERENCIA ===\n');
      
      return {
        diagnosis,
        dominantFactors,
        activations,
        confidence,
        isExtremeCase: false
      };
      
    } catch (error) {
      console.error('Error en inferencia:', error);
      return {
        diagnosis: 'Búsqueda Atención',
        dominantFactors: this.calculateDominantFactors(inputs),
        error: error.message,
        confidence: 0,
        activations: [],
        note: 'Error en procesamiento. Usando diagnóstico por defecto.',
        isExtremeCase: false
      };
    }
  }

  // Método para diagnóstico simplificado
  diagnose(categoryScores, rules, originalResponses = {}) {
    const result = this.inference(categoryScores, rules, originalResponses);
    
    return {
      diagnosis: result.diagnosis,
      dominantFactors: result.dominantFactors,
      categoryScores,
      totalScore: Object.values(categoryScores).reduce((sum, score) => sum + score, 0),
      confidence: result.confidence,
      activations: result.activations,
      error: result.error,
      note: result.note,
      isExtremeCase: result.isExtremeCase,
      extremeType: result.extremeType
    };
  }
}

// Procesador de respuestas: convierte respuestas individuales a promedios por categoría
export function ResponseProcessor(responses) {
  // responses: { Minuciosidad_0: 4.8, ... }
  const categorias = ['minuciosidad', 'emocionalidad', 'agresividad', 'dependiente', 'temerosidad'];
  const sumas = {};
  const conteos = {};
  
  // Inicializar contadores
  categorias.forEach(cat => { 
    sumas[cat] = 0; 
    conteos[cat] = 0; 
  });
  
  // Procesar respuestas
  Object.entries(responses).forEach(([key, value]) => {
    const [cat] = key.split('_');
    const catLower = cat.toLowerCase();
    if (categorias.includes(catLower)) {
      sumas[catLower] += parseFloat(value);
      conteos[catLower] += 1;
    }
  });
  
  // Calcular promedios
  const promedios = {};
  categorias.forEach(cat => {
    promedios[cat] = conteos[cat] > 0 ? sumas[cat] / conteos[cat] : 0;
  });
  
  console.log('Promedios por categoría:', Object.entries(promedios)
    .map(([k, v]) => `${k}: ${v.toFixed(2)}`).join(', '));
  
  return promedios;
}