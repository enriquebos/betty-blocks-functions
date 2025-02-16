import {
  queryOne,
  queryAll,
  modelCount,
  mutationCreate,
  mutationCreateMany,
  mutationDelete,
  mutationDeleteMany,
} from "../../utils/graphql";

interface WebUser {
  id: number;
  createdAt: Date;
}

interface Pokemon {
  id: number;
  name: string;
  favorite: Boolean;
  createdAt: Date;
  webuser: WebUser;
}

const testTing = async () => {
  const pokeFields = {
    id: Number,
    name: String,
    favorite: Boolean,
    createdAt: Date,
    webuser: {
      id: Number,
      createdAt: Date,
    },
  };

  const where = {
    _and: [
      {
        webuser: {
          emailAddress: { eq: "a@a.com" },
        },
      },
    ],
  };
  const sort: Sort = {
    field: "name",
    order: "ASC",
  };

  const newPokemonData = { name: "Panda", weight: 150 };
  const newPokemonsData = [
    { name: "Panda 1", weight: 150 },
    { name: "Panda 2", weight: 150 },
  ];

  // Create graphql object
  // Handle mass delete model
  // Remove duplicates
  // Handle mass delete with relation

  // const one = await queryOne<Pokemon>("Pokemon", pokeFields, where);
  // const all = await queryAll<Pokemon>("Pokemon", pokeFields, {
  //   where: where,
  //   take: 10,
  //   skip: 5,
  //   sort: sort,
  // });
  // const count = await modelCount("Pokemon", where);
  // const newPokemon = await mutationCreate("Pokemon", newPokemonData);
  // const deletePokemon = await mutationDeleteMany("Pokemon", [129]);
  const createPokemons = await mutationCreateMany("Pokemon", newPokemonsData);
  // const updatePokemon = await mutationUpdate("Pokemon", 131, {
  //   name: "Panda!",
  // });

  throw new Error(JSON.stringify(createPokemons));
};

export default testTing;
