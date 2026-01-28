interface importFile {
  id: number;
  name: "Bestaat" | "Bestaat niet" | "Wittevlek";
  file: {
    name: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Region {
  id: number;
  name: string;
}
