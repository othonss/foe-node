const { DataTypes } = require("sequelize")
const bcrypt = require('bcryptjs')

const db = require("../db/conn")

const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

(async () => {
  await db.sync(); 

  try {
    const existingUser = await User.findOne({ where: { identification: "000000" } });

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync("admin", salt)

    if (!existingUser) {
      await User.create({
        name: "Admin",
        identification: "000000",
        password: hashedPassword,
      });
      console.log("Registro padrão criado com sucesso.");
    } else {
      console.log("Registro padrão já existe, não foi necessário criar novamente.");
    }
  } catch (error) {
    console.error("Erro ao verificar/criar registro padrão:", error);
  }
})();

module.exports = User;
