-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "correo" VARCHAR(80) NOT NULL,
    "hash_contrasena" VARCHAR(255) NOT NULL,
    "rol" VARCHAR(20) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "mascota" (
    "id_mascota" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "raza" VARCHAR(50) NOT NULL,
    "edad_estimada" VARCHAR(30) NOT NULL,
    "especie" VARCHAR(10) NOT NULL,
    "sexo" VARCHAR(10),
    "tamano" VARCHAR(10),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'en_adopcion',
    "personalidad" TEXT,
    "salud_resumen" TEXT,
    "foto_url" VARCHAR(255),
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mascota_pkey" PRIMARY KEY ("id_mascota")
);

-- CreateTable
CREATE TABLE "adoptante" (
    "id_adoptante" SERIAL NOT NULL,
    "documento" VARCHAR(20) NOT NULL,
    "nombre_completo" VARCHAR(80) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "direccion" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(80),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'activo',
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adoptante_pkey" PRIMARY KEY ("id_adoptante")
);

-- CreateTable
CREATE TABLE "solicitud_adopcion" (
    "id_solicitud" SERIAL NOT NULL,
    "mascota_id" INTEGER NOT NULL,
    "adoptante_id" INTEGER NOT NULL,
    "tipo_vivienda" VARCHAR(20) NOT NULL,
    "animales_en_hogar" BOOLEAN NOT NULL DEFAULT false,
    "descripcion_vivienda" TEXT NOT NULL,
    "personas_en_hogar" INTEGER,
    "acepta_terminos" BOOLEAN NOT NULL DEFAULT false,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'en_revision',
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitud_adopcion_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "donacion" (
    "id_donacion" SERIAL NOT NULL,
    "tipo_aporte" VARCHAR(20) NOT NULL,
    "monto" INTEGER,
    "descripcion_insumo" TEXT,
    "cantidad" INTEGER,
    "nombre_donante" VARCHAR(80) NOT NULL,
    "correo" VARCHAR(80),
    "fecha_donacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "donacion_pkey" PRIMARY KEY ("id_donacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "adoptante_documento_key" ON "adoptante"("documento");

-- AddForeignKey
ALTER TABLE "solicitud_adopcion" ADD CONSTRAINT "solicitud_adopcion_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "mascota"("id_mascota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_adopcion" ADD CONSTRAINT "solicitud_adopcion_adoptante_id_fkey" FOREIGN KEY ("adoptante_id") REFERENCES "adoptante"("id_adoptante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donacion" ADD CONSTRAINT "donacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
