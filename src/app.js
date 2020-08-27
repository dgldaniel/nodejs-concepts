const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const checkUUID = isUuid(id);

  if (!checkUUID) {
    return response.status(400).json({ message: "ID is not uuid" });
  }

  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (indexRepository < 0) {
    return response.status(400).json({ message: "Repository not found" });
  }

  repositories[indexRepository] = {
    id,
    title,
    url,
    techs,
    likes: repositories[indexRepository].likes,
  };

  return response.json(repositories[indexRepository]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const checkUUID = isUuid(id);

  if (!checkUUID) {
    return response.status(400).json({ message: "ID is not uuid" });
  }

  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (indexRepository < 0) {
    return response.status(400).json({ message: "Repository not found" });
  }

  repositories.splice(indexRepository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const checkUUID = isUuid(id);

  if (!checkUUID) {
    return response.status(400).json({ message: "ID is not uuid" });
  }

  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (indexRepository < 0) {
    return response.status(400).json({ message: "Repository not found" });
  }

  repositories[indexRepository].likes++;

  return response.json(repositories[indexRepository]);
});

module.exports = app;
