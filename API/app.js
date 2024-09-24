import express from "express";
import { json } from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(json());

const uri = process.env.URI || "mongodb+srv://juliamaria13:juliamaria13@mundocinema.z7d59.mongodb.net/"; // Substitua pelo URI do seu MongoDB
const client = new MongoClient(uri);

async function conectarMongoDB() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB!");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
  }
}

// Usar o banco de dados correto: "mundoCinema"
const db = client.db("mundoCinema");
const noticiasCollection = db.collection("noticias");

// Rota para inserir uma nova notícia
app.post("/inserir-noticia", async (req, res) => {
    const novaNoticia = req.body;

    if (novaNoticia.conteudo) {
        novaNoticia.conteudo = novaNoticia.conteudo.replace(/<br\s*\/?>/g, "\n\n");
      }
  
    try {
      const result = await noticiasCollection.insertOne(novaNoticia);
      res.json({ message: "Notícia inserida com sucesso!", id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: "Erro ao inserir notícia", detalhes: err.message });
    }
  });

// Rota para obter todas as notícias
app.get("/noticias", async (req, res) => {
  try {
    const noticias = await noticiasCollection.find().toArray();
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter notícias", detalhes: err.message });
  }
});

app.get("/noticias/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const noticia = await noticiasCollection.findOne({ _id: new ObjectId(id) });

    if (noticia) {
      res.json(noticia);
    } else {
      res.status(404).json({ error: "Notícia não encontrada" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter notícia", detalhes: err.message });
  }
});

  

// Rota para atualizar uma notícia por ID
app.put("/noticias/:id", async (req, res) => {
  const id = req.params.id;
  const novosDados = req.body;

  try {
    const result = await noticiasCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: novosDados }
    );

    if (result.modifiedCount > 0) {
      res.json({ message: "Notícia atualizada com sucesso!" });
    } else {
      res.status(404).json({ error: "Notícia não encontrada" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar notícia", detalhes: err.message });
  }
});

// Rota para deletar uma notícia por ID
app.delete("/noticias/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await noticiasCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.json({ message: "Notícia deletada com sucesso!" });
    } else {
      res.status(404).json({ error: "Notícia não encontrada" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar notícia", detalhes: err.message });
  }
});

// Iniciar o servidor e conectar ao MongoDB
app.listen(3007, async () => {
  await conectarMongoDB();
  console.log("Servidor ativado na porta 3007");
});
