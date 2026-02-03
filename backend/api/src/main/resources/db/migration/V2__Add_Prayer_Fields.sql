ALTER TABLE peticiones_oracion ADD COLUMN tipo VARCHAR(50) DEFAULT 'OTRO' NOT NULL;
ALTER TABLE peticiones_oracion ADD COLUMN oracion_por VARCHAR(255);
