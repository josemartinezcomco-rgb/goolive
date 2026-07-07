// Base de alimentos real. Macros por 100 g de porción comestible.
// Valores redondeados de tablas de composición de alimentos (USDA / ICBF Colombia).
// kcal se calcula desde los macros (4·P + 4·C + 9·G) para mantener coherencia interna.
// Esto NO es una estimación por foto: son datos reales por gramo registrado.

/** @typedef {{id:string,nombre:string,cat:string,p:number,c:number,g:number}} Alimento
 *  p/c/g = gramos de proteína/carbohidrato/grasa por 100 g. */

/** @type {Alimento[]} */
export const ALIMENTOS = [
  // Proteínas animales
  { id: 'pollo_pechuga', nombre: 'Pechuga de pollo (cocida)', cat: 'Proteína', p: 31.0, c: 0.0, g: 3.6 },
  { id: 'huevo', nombre: 'Huevo entero', cat: 'Proteína', p: 12.6, c: 1.1, g: 9.5 },
  { id: 'clara_huevo', nombre: 'Clara de huevo', cat: 'Proteína', p: 11.0, c: 0.7, g: 0.2 },
  { id: 'salmon', nombre: 'Salmón', cat: 'Proteína', p: 20.4, c: 0.0, g: 13.4 },
  { id: 'atun_agua', nombre: 'Atún en agua', cat: 'Proteína', p: 25.5, c: 0.0, g: 0.8 },
  { id: 'carne_res_magra', nombre: 'Carne de res magra', cat: 'Proteína', p: 26.0, c: 0.0, g: 8.0 },
  { id: 'cerdo_lomo', nombre: 'Lomo de cerdo', cat: 'Proteína', p: 27.0, c: 0.0, g: 7.0 },
  { id: 'tilapia', nombre: 'Tilapia', cat: 'Proteína', p: 26.0, c: 0.0, g: 2.7 },
  { id: 'yogur_griego', nombre: 'Yogur griego natural', cat: 'Proteína', p: 10.0, c: 3.6, g: 0.4 },
  { id: 'queso_campesino', nombre: 'Queso campesino', cat: 'Proteína', p: 18.0, c: 3.0, g: 20.0 },
  { id: 'proteina_whey', nombre: 'Proteína whey (polvo)', cat: 'Proteína', p: 80.0, c: 8.0, g: 6.0 },

  // Carbohidratos / cereales / tubérculos
  { id: 'arroz_blanco', nombre: 'Arroz blanco (cocido)', cat: 'Carbohidrato', p: 2.7, c: 28.0, g: 0.3 },
  { id: 'arroz_integral', nombre: 'Arroz integral (cocido)', cat: 'Carbohidrato', p: 2.6, c: 23.0, g: 0.9 },
  { id: 'avena', nombre: 'Avena en hojuelas', cat: 'Carbohidrato', p: 13.0, c: 68.0, g: 7.0 },
  { id: 'arepa', nombre: 'Arepa de maíz', cat: 'Carbohidrato', p: 5.0, c: 43.0, g: 2.5 },
  { id: 'pan_integral', nombre: 'Pan integral', cat: 'Carbohidrato', p: 9.0, c: 43.0, g: 3.5 },
  { id: 'papa', nombre: 'Papa cocida', cat: 'Carbohidrato', p: 2.0, c: 20.0, g: 0.1 },
  { id: 'yuca', nombre: 'Yuca cocida', cat: 'Carbohidrato', p: 1.4, c: 38.0, g: 0.3 },
  { id: 'platano', nombre: 'Plátano', cat: 'Carbohidrato', p: 1.3, c: 32.0, g: 0.4 },
  { id: 'pasta', nombre: 'Pasta (cocida)', cat: 'Carbohidrato', p: 5.0, c: 25.0, g: 1.1 },
  { id: 'frijol', nombre: 'Fríjol (cocido)', cat: 'Carbohidrato', p: 9.0, c: 27.0, g: 0.5 },
  { id: 'lenteja', nombre: 'Lenteja (cocida)', cat: 'Carbohidrato', p: 9.0, c: 20.0, g: 0.4 },
  { id: 'quinua', nombre: 'Quinua (cocida)', cat: 'Carbohidrato', p: 4.4, c: 21.0, g: 1.9 },

  // Frutas y verduras
  { id: 'banano', nombre: 'Banano', cat: 'Fruta/Verdura', p: 1.1, c: 23.0, g: 0.3 },
  { id: 'manzana', nombre: 'Manzana', cat: 'Fruta/Verdura', p: 0.3, c: 14.0, g: 0.2 },
  { id: 'fresa', nombre: 'Fresa', cat: 'Fruta/Verdura', p: 0.7, c: 7.7, g: 0.3 },
  { id: 'brocoli', nombre: 'Brócoli', cat: 'Fruta/Verdura', p: 2.8, c: 7.0, g: 0.4 },
  { id: 'espinaca', nombre: 'Espinaca', cat: 'Fruta/Verdura', p: 2.9, c: 3.6, g: 0.4 },
  { id: 'tomate', nombre: 'Tomate', cat: 'Fruta/Verdura', p: 0.9, c: 3.9, g: 0.2 },

  // Grasas
  { id: 'aguacate', nombre: 'Aguacate', cat: 'Grasa', p: 2.0, c: 9.0, g: 15.0 },
  { id: 'almendra', nombre: 'Almendras', cat: 'Grasa', p: 21.0, c: 22.0, g: 49.0 },
  { id: 'mani', nombre: 'Maní', cat: 'Grasa', p: 26.0, c: 16.0, g: 49.0 },
  { id: 'aceite_oliva', nombre: 'Aceite de oliva', cat: 'Grasa', p: 0.0, c: 0.0, g: 100.0 },
  { id: 'mantequilla_mani', nombre: 'Mantequilla de maní', cat: 'Grasa', p: 25.0, c: 20.0, g: 50.0 },
];

/** kcal por 100 g, derivadas de los macros (Atwater 4/4/9). */
export const kcalPor100 = (a) => a.p * 4 + a.c * 4 + a.g * 9;

export const alimentoPorId = (id) => ALIMENTOS.find((a) => a.id === id);
