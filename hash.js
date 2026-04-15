const bcrypt = require("bcrypt");

async function generateHash() {
  const password = "123456789";
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);

  console.log("Contraseña:", password);
  console.log("Hash generado:", hash);
  console.log("\nCopia este SQL y ejecútalo en Supabase:");
  console.log(
    `UPDATE usuarios SET contrasena_encriptada = '${hash}' WHERE correo_electronico = 'admin@test.com';`,
  );
}

generateHash();
