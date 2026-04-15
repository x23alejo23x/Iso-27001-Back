-- CreateTable
CREATE TABLE "biblioteca_de_controles" (
    "id_control_maestro" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "codigo_norma" VARCHAR(50) NOT NULL,
    "nombre_del_control" VARCHAR(255) NOT NULL,
    "explicacion_del_control" TEXT,
    "area_o_dominio" VARCHAR(100),
    "tipo_control" VARCHAR,

    CONSTRAINT "biblioteca_de_controles_pkey" PRIMARY KEY ("id_control_maestro")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id_empresa" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nombre_comercial" VARCHAR(150) NOT NULL,
    "codigo_unico_url" VARCHAR(100) NOT NULL,
    "fecha_de_registro" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "evidencias_del_control" (
    "id_evidencia" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "seguimiento_id" UUID,
    "nombre_del_archivo" VARCHAR(255) NOT NULL,
    "link_al_archivo" TEXT NOT NULL,
    "usuario_que_subio_id" UUID,
    "fecha_de_subida" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidencias_del_control_pkey" PRIMARY KEY ("id_evidencia")
);

-- CreateTable
CREATE TABLE "seguimiento_de_cumplimiento" (
    "id_seguimiento" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "empresa_id" UUID,
    "control_id" UUID,
    "estado_id" INTEGER,
    "nombre_del_responsable" VARCHAR(150),
    "quien_actualizo_id" UUID,
    "fecha_de_modificacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "descripcion_justificacion" TEXT,

    CONSTRAINT "seguimiento_de_cumplimiento_pkey" PRIMARY KEY ("id_seguimiento")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "empresa_id" UUID,
    "rol_id" INTEGER,
    "nombre_usuario" VARCHAR(150) NOT NULL,
    "correo_electronico" VARCHAR(150) NOT NULL,
    "contrasena_encriptada" TEXT NOT NULL,
    "fecha_registro" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "estados_de_control" (
    "id_estado" SERIAL NOT NULL,
    "nombre_del_estado" VARCHAR(50) NOT NULL,
    "descripcion_del_estado" TEXT,

    CONSTRAINT "estados_de_control_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "roles_de_usuario" (
    "id_rol" SERIAL NOT NULL,
    "nombre_del_rol" VARCHAR(50) NOT NULL,
    "descripcion_del_permiso" TEXT,

    CONSTRAINT "roles_de_usuario_pkey" PRIMARY KEY ("id_rol")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_codigo_unico_url_key" ON "empresas"("codigo_unico_url");

-- CreateIndex
CREATE UNIQUE INDEX "control_unico_por_empresa" ON "seguimiento_de_cumplimiento"("empresa_id", "control_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_unico" ON "usuarios"("correo_electronico");

-- CreateIndex
CREATE UNIQUE INDEX "estados_de_control_nombre_del_estado_key" ON "estados_de_control"("nombre_del_estado");

-- AddForeignKey
ALTER TABLE "evidencias_del_control" ADD CONSTRAINT "evidencias_del_control_seguimiento_id_fkey" FOREIGN KEY ("seguimiento_id") REFERENCES "seguimiento_de_cumplimiento"("id_seguimiento") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidencias_del_control" ADD CONSTRAINT "evidencias_del_control_usuario_que_subio_id_fkey" FOREIGN KEY ("usuario_que_subio_id") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seguimiento_de_cumplimiento" ADD CONSTRAINT "seguimiento_de_cumplimiento_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "biblioteca_de_controles"("id_control_maestro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seguimiento_de_cumplimiento" ADD CONSTRAINT "seguimiento_de_cumplimiento_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id_empresa") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seguimiento_de_cumplimiento" ADD CONSTRAINT "seguimiento_de_cumplimiento_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados_de_control"("id_estado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seguimiento_de_cumplimiento" ADD CONSTRAINT "seguimiento_de_cumplimiento_quien_actualizo_id_fkey" FOREIGN KEY ("quien_actualizo_id") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id_empresa") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles_de_usuario"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;
