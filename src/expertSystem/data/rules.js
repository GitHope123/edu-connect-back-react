// src/expertSystem/data/rules.js

// Cuestionario con preguntas y opciones de respuesta
export const cuestionario = {
  categorias: [
    {
      name: "Minuciosidad",
      preguntas: [
        "¿Con qué frecuencia revisas tus tareas antes de entregarlas?",
        "¿Eres cuidadoso(a) con los detalles en tus trabajos escolares?",
        "¿Te aseguras de cumplir con todas las indicaciones dadas por el profesor?",
        "¿Organizas tu material y tus actividades con anticipación?"
      ]
    },
    {
      name: "Emocionalidad",
      preguntas: [
        "¿Te resulta difícil controlar tus emociones ante situaciones inesperadas?",
        "¿Sueles sentirte abrumado(a) por tus sentimientos?",
        "¿Te afectan mucho las críticas o comentarios de los demás?",
        "¿Te alteras fácilmente cuando algo no sale como esperabas?"
      ]
    },
    {
      name: "Agresividad",
      preguntas: [
        "¿Te enojas con facilidad cuando discutes con tus compañeros?",
        "¿Has tenido reacciones violentas (verbales o físicas) en el último mes?",
        "¿Sueles levantar la voz o gritar cuando estás molesto(a)?",
        "¿Te irritas cuando las cosas no salen a tu manera?"
      ]
    },
    {
      name: "Dependiente",
      preguntas: [
        "¿Buscas la aprobación de otros antes de tomar decisiones?",
        "¿Prefieres que alguien más resuelva tus problemas?",
        "¿Te cuesta actuar por tu cuenta sin ayuda de tus amigos o familiares?",
        "¿Sientes inseguridad al estar solo(a) frente a una situación nueva?"
      ]
    },
    {
      name: "Temerosidad",
      preguntas: [
        "¿Evitas participar en actividades nuevas por miedo a equivocarte?",
        "¿Te sientes nervioso(a) al hablar en público o frente a la clase?",
        "¿Te preocupa mucho lo que los demás piensen de ti?",
        "¿Te paralizas ante situaciones que consideras difíciles o desafiantes?"
      ]
    }
  ],
  opciones: [
    { texto: "Nunca", valor: 0 },
    { texto: "Rara vez", valor: 1.6 },
    { texto: "A veces", valor: 3.2 },
    { texto: "Frecuentemente", valor: 4.8 },
    { texto: "Siempre", valor: 6.4 }
  ]
};

// Reglas de lógica difusa basadas en la TABLA VII corregida
export const fuzzyRules = [
  // Reglas 1-16: Búsqueda de Atención (Minuciosidad Normal)
  // Minuciosidad Normal + Emocionalidad Inestable
  {
    id: 1,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'inestable',
      agresividad: 'normal',
      dependiente: 'normal',
      temerosidad: 'normal'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 2,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'inestable',
      agresividad: 'normal',
      dependiente: 'normal',
      temerosidad: 'alto'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 3,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'inestable',
      agresividad: 'normal',
      dependiente: 'alto',
      temerosidad: 'normal'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 4,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'inestable',
      agresividad: 'normal',
      dependiente: 'alto',
      temerosidad: 'alto'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 5,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'inestable',
      agresividad: 'alto',
      dependiente: 'normal',
      temerosidad: 'normal'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 6,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'inestable',
      agresividad: 'alto',
      dependiente: 'normal',
      temerosidad: 'alto'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 7,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'inestable',
      agresividad: 'alto',
      dependiente: 'alto',
      temerosidad: 'normal'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 8,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'inestable',
      agresividad: 'alto',
      dependiente: 'alto',
      temerosidad: 'alto'
    },
    consequent: 'Búsqueda Atención'
  },
  // Minuciosidad Normal + Emocionalidad Estable
  {
    id: 9,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'estable',
      agresividad: 'normal',
      dependiente: 'normal',
      temerosidad: 'normal'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 10,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'estable',
      agresividad: 'normal',
      dependiente: 'normal',
      temerosidad: 'alto'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 11,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'estable',
      agresividad: 'normal',
      dependiente: 'alto',
      temerosidad: 'normal'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 12,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'estable',
      agresividad: 'normal',
      dependiente: 'alto',
      temerosidad: 'alto'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 13,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'estable',
      agresividad: 'alto',
      dependiente: 'normal',
      temerosidad: 'normal'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 14,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'estable',
      agresividad: 'alto',
      dependiente: 'normal',
      temerosidad: 'alto'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 15,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'estable',
      agresividad: 'alto',
      dependiente: 'alto',
      temerosidad: 'normal'
    },
    consequent: 'Búsqueda Atención'
  },
  {
    id: 16,
    antecedent: {
      minuciosidad: 'normal',
      emocionalidad: 'estable',
      agresividad: 'alto',
      dependiente: 'alto',
      temerosidad: 'alto'
    },
    consequent: 'Búsqueda Atención'
  },

  // Reglas 17-24: Conducta Dependiente (Minuciosidad Alta + Emocionalidad Inestable)
  {
    id: 17,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'inestable',
      agresividad: 'normal',
      dependiente: 'normal',
      temerosidad: 'normal'
    },
    consequent: 'Conducta Dependiente'
  },
  {
    id: 18,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'inestable',
      agresividad: 'normal',
      dependiente: 'normal',
      temerosidad: 'alto'
    },
    consequent: 'Conducta Dependiente'
  },
  {
    id: 19,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'inestable',
      agresividad: 'normal',
      dependiente: 'alto',
      temerosidad: 'normal'
    },
    consequent: 'Conducta Dependiente'
  },
  {
    id: 20,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'inestable',
      agresividad: 'normal',
      dependiente: 'alto',
      temerosidad: 'alto'
    },
    consequent: 'Conducta Dependiente'
  },
  {
    id: 21,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'inestable',
      agresividad: 'alto',
      dependiente: 'normal',
      temerosidad: 'normal'
    },
    consequent: 'Conducta Dependiente'
  },
  {
    id: 22,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'inestable',
      agresividad: 'alto',
      dependiente: 'normal',
      temerosidad: 'alto'
    },
    consequent: 'Conducta Dependiente'
  },
  {
    id: 23,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'inestable',
      agresividad: 'alto',
      dependiente: 'alto',
      temerosidad: 'normal'
    },
    consequent: 'Conducta Dependiente'
  },
  {
    id: 24,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'inestable',
      agresividad: 'alto',
      dependiente: 'alto',
      temerosidad: 'alto'
    },
    consequent: 'Conducta Dependiente'
  },

  // Reglas 25-32: Inhibición Conductual (Minuciosidad Alta + Emocionalidad Estable)
  {
    id: 25,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'estable',
      agresividad: 'normal',
      dependiente: 'normal',
      temerosidad: 'normal'
    },
    consequent: 'Inhibición Conductual'
  },
  {
    id: 26,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'estable',
      agresividad: 'normal',
      dependiente: 'normal',
      temerosidad: 'alto'
    },
    consequent: 'Inhibición Conductual'
  },
  {
    id: 27,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'estable',
      agresividad: 'normal',
      dependiente: 'alto',
      temerosidad: 'normal'
    },
    consequent: 'Inhibición Conductual'
  },
  {
    id: 28,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'estable',
      agresividad: 'normal',
      dependiente: 'alto',
      temerosidad: 'alto'
    },
    consequent: 'Inhibición Conductual'
  },
  {
    id: 29,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'estable',
      agresividad: 'alto',
      dependiente: 'normal',
      temerosidad: 'normal'
    },
    consequent: 'Inhibición Conductual'
  },
  {
    id: 30,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'estable',
      agresividad: 'alto',
      dependiente: 'normal',
      temerosidad: 'alto'
    },
    consequent: 'Inhibición Conductual'
  },
  {
    id: 31,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'estable',
      agresividad: 'alto',
      dependiente: 'alto',
      temerosidad: 'normal'
    },
    consequent: 'Inhibición Conductual'
  },
  {
    id: 32,
    antecedent: {
      minuciosidad: 'alto',
      emocionalidad: 'estable',
      agresividad: 'alto',
      dependiente: 'alto',
      temerosidad: 'alto'
    },
    consequent: 'Inhibición Conductual'
  }
];

// Configuración de rangos para variables
export const variableRanges = {
  minuciosidad: { min: 0, max: 6.4 },
  emocionalidad: { min: 0, max: 6.4 },
  agresividad: { min: 0, max: 6.4 },
  dependiente: { min: 0, max: 6.4 },
  temerosidad: { min: 0, max: 6.4 }
};

// Configuración de salidas
export const outputConfig = {
  diagnosticos: [
    'Búsqueda Atención',
    'Conducta Dependiente',
    'Inhibición Conductual'
  ],
  rangoPuntuacion: { min: 0, max: 32 }
};
