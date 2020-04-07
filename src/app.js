const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const uid = uuid();

  const repository = { uid, title, url, techs, likes: 0 };

  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!id) {
    return response.status(400).json({
      message: "The id is necessary to edit a repository",
    });
  }

  const checkRepository = repositories.find(
    (repository) => repository.uid == id
  );

  if (!checkRepository) {
    return response.status(400).json({
      message: "Repository not find",
    });
  }

  const updatevalues = (value) => {
    if (value === "title") {
      checkRepository.title = title;
    }
    if (value === "url") {
      checkRepository.url = url;
    }
    if (value === "techs") {
      checkRepository.techs = techs;
    }
  };

  Object.keys(request.body).map((item) => item && updatevalues(item));

  response.json({ checkRepository });
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const checkRepository = repositories.find(
    (repository) => repository.uid == id
  );

  if (!checkRepository) {
    return res.status(400).json({
      message: "Repository not find",
    });
  }

  const repositoryId = repositories.indexOf(checkRepository);

  if (repositoryId !== -1) {
    repositories.splice(repositoryId, 1);
    return res.status(204).json();
  }

  return res.status(400).json({
    message: "Repository not find",
  });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const checkRepository = repositories.find(
    (repository) => repository.uid == id
  );

  if (!checkRepository) {
    return response.status(400).json({
      message: "Repository not find",
    });
  }

  checkRepository.likes = checkRepository.likes + 1;

  return response.status(201).json(checkRepository.likes);
});

module.exports = app;
