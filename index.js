import { promises as fs } from "fs";

init();

async function init() {
  await createFiles();
  await imprimirDados(true);
  await imprimirDados(false);
  await maiorCidade(true);
  await maiorCidade(false);
}

async function createFiles() {
  let data = await fs.readFile("./backend/Estados.json");
  const states = JSON.parse(data);
  data = await fs.readFile("./backend/Cidades.json");
  const cidades = JSON.parse(data);

  for (const state of states) {
    const cidadeUF = cidades.filter((city) => city.Estado === state.ID);
    await fs.writeFile(
      `./states/${state.Sigla}.json`,
      JSON.stringify(cidadeUF)
    );
  }
}

async function lerCidades(UF) {
  let data = await fs.readFile(`./states/${UF}.json`);
  let qtdCidades = JSON.parse(data);
  return qtdCidades.length;
}

async function lerNomeMaior(nome) {
  let data = await fs.readFile(`./states/${nome}.json`);
  let tamanhoNome = JSON.parse(data);
  let Resultado;
  tamanhoNome.forEach((city) => {
    if (!Resultado) {
      Resultado = city;
    } else if (city.Nome.length > Resultado.Nome.length) {
      Resultado = city;
    } else if (
      city.Nome.length === Resultado.Nome.length &&
      city.Nome.toLowerCase() < Resultado.Nome.toLowerCase()
    ) {
      Resultado = city;
    }
  });
  return Resultado;
}
async function lerNomeMenor(nome) {
  let data = await fs.readFile(`./states/${nome}.json`);
  let tamanhoNome = JSON.parse(data);
  let Resultado;
  tamanhoNome.forEach((city) => {
    if (!Resultado) {
      Resultado = city;
    } else if (city.Nome.length < Resultado.Nome.length) {
      Resultado = city;
    } else if (
      city.Nome.length === Resultado.Nome.length &&
      city.Nome.toLowerCase() < Resultado.Nome.toLowerCase()
    ) {
      Resultado = city;
    }
  });
  return Resultado;
}
async function imprimirDados(more) {
  let data = JSON.parse(await fs.readFile(`./backend/Estados.json`));
  const arr = [];
  for (const state of data) {
    const cidade = await lerCidades(state.Sigla);
    arr.push({ uf: state.Sigla, cidade });
  }

  arr.sort((a, b) => {
    if (a.cidade < b.cidade) return 1;
    else if (a.cidade > b.cidade) return -1;
    else return 0;
  });
  const Resultado = [];
  if (more) {
    arr
      .slice(0, 5)
      .forEach((item) => Resultado.push(`${item.uf} - ${item.cidade}`));
  } else {
    arr
      .slice(-5)
      .forEach((item) => Resultado.push(`${item.uf} - ${item.cidade}`));
  }

  console.log(Resultado);
}

async function maiorCidade(bigger) {
  let data = JSON.parse(await fs.readFile(`./backend/Estados.json`));
  const arr = [];
  for (const state of data) {
    let city;
    if (bigger) {
      city = await lerNomeMaior(state.Sigla);
    } else {
      city = await lerNomeMenor(state.Sigla);
    }
    arr.push({ name: city.Nome, uf: state.Sigla });
  }

  arr.sort((a, b) => {
    if (a.name.length < b.name.length) return 1;
    else if (a.name.length > b.name.length) return -1;
    else return 0;
  });

  const Resultado = [];
  if (bigger) {
    arr
      .slice(0, 1)
      .forEach((item) => Resultado.push(`${item.name} - ${item.uf}`));
  } else {
    arr
      .slice(-1)
      .forEach((item) => Resultado.push(`${item.name} - ${item.uf}`));
  }

  console.log(Resultado);
}
