// export function calcularPotencia(comodo) {
//   const { area, tipo } = comodo;
//   if (tipo === "molhada") return 200 + Math.floor(area / 4) * 100;
//   return 100 + Math.floor(area / 4) * 60;
// }

// export function calcularCorrente(potencia, tensao) {
//   return Number((potencia / tensao).toFixed(2));
// }

// export function calcularCircuito(comodo, numero) {
//   const potencia = calcularPotencia(comodo);
//   const corrente = calcularCorrente(potencia, comodo.tensao);

//   return {
//     numero,
//     descricao: `Iluminação - ${comodo.nome}`,
//     tensao: comodo.tensao,
//     potencia,
//     corrente,
//     disjuntor: 10,
//     secao: 1.5,
//     dr: "Sim",
//     barramento: "A",
//   };
// }
