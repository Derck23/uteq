const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const serviceAccount = require("../../claves/idgs09-dwp-8vo-firebase-adminsdk-fbsvc-92c3ba000f.json");

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://idgs09-dwp-8vo-default-rtdb.firebaseio.com/",
});

const db = admin.firestore();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // ✅ Permite solicitudes desde el frontend
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

app.options("*", cors());

const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ intMessage: "Acceso denegado. Token requerido" });
  }

  jwt.verify(token.split(" ")[1], "claveSecreta", (err, decoded) => {
    if (err) {
      return res.status(401).json({ intMessage: "Token inválido o expirado" });
    }
    req.usuario = decoded;
    next();
  });
};

const handleError = (res, error, customMessage = "Error interno") => {
  console.error(customMessage, error);
  res.status(500).json({ intMessage: customMessage, error: error.message || error });
};

const getDocumentById = async (collection, id) => {
  const docRef = db.collection(collection).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) throw new Error(`Documento con ID ${id} no encontrado`);
  return { id: docSnap.id, ...docSnap.data() };
};

// Login
app.post("/api/acceso", async (req, res) => {
  const { usuario, contra } = req.body;
  try {
    const userSnapshot = await db.collection("Users").where("username", "==", usuario).get();
    if (userSnapshot.empty) {
      return res.status(401).json({ intMessage: "Usuario no encontrado" });
    }

    const userData = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;
    const passwordMatch = await bcrypt.compare(contra, userData.password);

    if (!passwordMatch) {
      return res.status(401).json({ intMessage: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { username: usuario, rol: userData.rol, id: userId },
      "claveSecreta",
      { expiresIn: "10m" }
    );

    await userSnapshot.docs[0].ref.update({ last_login: new Date() });
    res.status(200).json({
      token,
      intMessage: "Bienvenido al sistema",
      data: { username: usuario, rol: userData.rol },
    });
  } catch (error) {
    handleError(res, error, "Error al iniciar sesión");
  }
});

// Registro
app.post("/api/registro", async (req, res) => {
  const { usuario, correo, contra } = req.body;
  if (!usuario || !correo || !contra) {
    return res.status(400).json({ intMessage: "Faltan datos" });
  }

  try {
    const userSnapshot = await db.collection("Users").where("username", "==", usuario).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ intMessage: "Usuario ya existe" });
    }

    const hashPassword = await bcrypt.hash(contra, 10);
    await db.collection("Users").add({
      username: usuario,
      email: correo,
      password: hashPassword,
      last_login: null,
      rol: "work",
    });
    res.status(201).json({ intMessage: "Usuario registrado con éxito" });
  } catch (error) {
    handleError(res, error, "Error al registrar usuario");
  }
});

// Obtener tareas
app.get("/api/tareas", verificarToken, async (req, res) => {
  const usuario = req.usuario.username;
  const { groupId } = req.query; // Permite filtrar tareas por grupo

  try {
      let tasksSnapshot;
      let tasks = [];

      if (groupId) {
          console.log("Obteniendo tareas para el grupo ID:", groupId);
          // Obtener tareas del grupo
          tasksSnapshot = await db.collection("Tasks").where("grupoId", "==", groupId).get();
          tasks = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } else {
          console.log("Obteniendo tareas para el usuario:", usuario);
          // Obtener tareas personales y asignadas
          const tasksCreatedByUser = await db.collection("Tasks").where("usuario", "==", usuario).get();
          const tasksAssignedToUser = await db.collection("Tasks").where("usuarioAsignadoNombre", "==", usuario).get();

          // Combinar los resultados
          tasksSnapshot = [...tasksCreatedByUser.docs, ...tasksAssignedToUser.docs];
          tasks = tasksSnapshot.map((doc) => ({ id: doc.id, ...doc.data() }));
      }

      console.log("Tareas encontradas:", tasks);
      res.status(200).json({ intMessage: "Tareas encontradas", data: tasks });
  } catch (error) {
      console.error("Error al obtener tareas", error);
      res.status(500).json({ intMessage: "Error al obtener tareas", error: error.message });
  }
});

// Crear tarea
app.post("/api/tareas", verificarToken, async (req, res) => {
  const { titulo, descripcion, fechaLimite, estado, categoria, grupoId, usuarioAsignadoId, usuarioAsignadoNombre } = req.body;
  const usuario = req.usuario.username;

  try {
    const taskData = {
      titulo,
      descripcion,
      fechaLimite,
      estado,
      categoria,
      usuario: usuarioAsignadoId || usuario, // Si es una tarea de grupo, asignarla al usuario seleccionado
      grupoId: grupoId || null, // Guardar el ID del grupo si existe
      usuarioAsignadoNombre: usuarioAsignadoNombre || null, // Guardar el nombre del usuario asignado si existe
    };

    await db.collection("Tasks").add(taskData);
    res.status(201).json({ intMessage: "Tarea creada con éxito" });
  } catch (error) {
    console.error("Error al crear tarea", error);
    res.status(500).json({ intMessage: "Error al crear tarea", error: error.message });
  }
});

app.put("/api/tareas/:id", verificarToken, async (req, res) => {
    const taskId = req.params.id;
    const { titulo, descripcion, fechaLimite, estado, categoria, usuarioAsignadoId, usuarioAsignadoNombre } = req.body;

    try {
        const taskRef = db.collection("Tasks").doc(taskId);
        const taskDoc = await taskRef.get();

        if (!taskDoc.exists) {
            return res.status(404).json({ intMessage: "Tarea no encontrada" });
        }

        const updateData = {
            titulo,
            descripcion,
            fechaLimite,
            estado,
            categoria,
            usuario: usuarioAsignadoId || taskDoc.data().usuario,
            usuarioAsignadoNombre: usuarioAsignadoNombre || taskDoc.data().usuarioAsignadoNombre,
        };

        // Filtrar valores undefined
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        await taskRef.update(updateData);

        res.status(200).json({ intMessage: "Tarea actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar tarea", error);
        res.status(500).json({ intMessage: "Error al actualizar tarea", error: error.message });
    }
});

app.delete("/api/tareas/:id", verificarToken, async (req, res) => {
  try {
      const taskId = req.params.id;
      const taskDocRef = db.collection("Tasks").doc(taskId);
      const taskDoc = await taskDocRef.get();
      if (!taskDoc.exists) {
          return res.status(404).json({ intMessage: "Tarea no encontrada" });
      }
      await taskDocRef.delete();
      res.status(200).json({ intMessage: "Tarea eliminada con éxito" });
  } catch (error) {
      handleError(res, error, "Error al eliminar tarea");
  }
});

// Obtener usuarios
// Obtener usuario por ID
// Obtener todos los usuarios
app.get("/api/usuarios", verificarToken, async (req, res) => {
  try {
      const usersSnapshot = await db.collection("Users").get();
      const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.status(200).json({ intMessage: "Usuarios encontrados", data: users });
  } catch (error) {
      handleError(res, error, "Error al obtener usuarios");
  }
});

// Obtener usuario por ID
app.get("/api/usuarios/:id", verificarToken, async (req, res) => {
  try {
      const userId = req.params.id;
      const userDoc = await getDocumentById("Users", userId);
      res.status(200).json({ intMessage: "Usuario encontrado", data: userDoc });
  } catch (error) {
      if (error.message.includes("no encontrado")) {
          return res.status(404).json({ intMessage: error.message });
      }
      handleError(res, error, "Error al obtener usuario");
  }
});

app.put("/api/usuarios/:id", verificarToken, async (req, res) => {
    const userId = req.params.id;
    const { username, email, rol } = req.body;

    try {
        const userRef = db.collection("Users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ intMessage: "Usuario no encontrado" });
        }

        await userRef.update({
            username,
            email,
            rol,
        });

        res.status(200).json({ intMessage: "Usuario actualizado con éxito" });
    } catch (error) {
        console.error("Error al actualizar usuario", error);
        res.status(500).json({ intMessage: "Error al actualizar usuario", error: error.message });
    }
});

app.get("/api/grupos/:id/miembros", verificarToken, async (req, res) => {
  try {
      const groupId = req.params.id;
      const groupDoc = await getDocumentById("Grupos", groupId);
      const usuarios = groupDoc.usuarios || [];
      res.status(200).json({ intMessage: "Miembros del grupo encontrados", data: usuarios });
  } catch (error) {
      if (error.message.includes("no encontrado")) {
          return res.status(404).json({ intMessage: error.message });
      }
      handleError(res, error, "Error al obtener miembros del grupo");
  }
});

// Grupos
app.get("/api/grupos", verificarToken, async (req, res) => {
    const creadorId = req.query.creadorId || req.usuario.id; // Get creadorId from query params or use logged-in user id

    try {
        const gruposSnapshot = await db.collection("Grupos").where("creadorId", "==", creadorId).get();
        const grupos = gruposSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ intMessage: "Grupos encontrados", data: grupos });
    } catch (error) {
        handleError(res, error, "Error al obtener grupos");
    }
});

app.post("/api/grupos", verificarToken, async (req, res) => {
  const { nombreGrupo, usuarios } = req.body;
  const creadorId = req.usuario.id;

  if (!nombreGrupo || !usuarios || !Array.isArray(usuarios)) {
    return res.status(400).json({ intMessage: "Datos inválidos" });
  }

  try {
    const grupoRef = await db.collection("Grupos").add({ nombreGrupo, usuarios, creadorId });
    res.status(201).json({ intMessage: "Grupo creado con éxito", id: grupoRef.id });
  } catch (error) {
    handleError(res, error, "Error al crear grupo");
  }
});

app.patch("/api/grupos/:id", verificarToken, async (req, res) => {
  try {
      const groupId = req.params.id;
      const { nombreGrupo, usuarios } = req.body;
      const groupDocRef = db.collection("Grupos").doc(groupId);
      const groupDoc = await groupDocRef.get();

      if (!groupDoc.exists) {
          return res.status(404).json({ intMessage: "Grupo no encontrado" });
      }

      await groupDocRef.update({ nombreGrupo, usuarios });
      res.status(200).json({ intMessage: "Grupo actualizado con éxito" });
  } catch (error) {
      handleError(res, error, "Error al actualizar grupo");
  }
});


// Eliminar grupo por ID
app.delete("/api/grupos/:id", verificarToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const groupDocRef = db.collection("Grupos").doc(groupId);
    const groupDoc = await groupDocRef.get();
    if (!groupDoc.exists) {
      return res.status(404).json({ intMessage: "Grupo no encontrado" });
    }
    await groupDocRef.delete();
    res.status(200).json({ intMessage: "Grupo eliminado con éxito" });
  } catch (error) {
    handleError(res, error, "Error al eliminar grupo");
  }
});


const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
