ALTER TABLE "donacion" ALTER COLUMN "usuario_id" DROP NOT NULL;

ALTER TABLE "donacion" ADD COLUMN "adoptante_id" INTEGER;

ALTER TABLE "donacion" ADD COLUMN "estado" VARCHAR(20) NOT NULL DEFAULT 'recibida';

ALTER TABLE "donacion" ADD CONSTRAINT "donacion_adoptante_id_fkey"
FOREIGN KEY ("adoptante_id") REFERENCES "adoptante"("id_adoptante")
ON DELETE RESTRICT ON UPDATE CASCADE;
