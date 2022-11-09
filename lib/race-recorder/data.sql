---DROP SEQUENCE IF EXISTS drivers_id_seq;
---DROP SEQUENCE IF EXISTS records_id_seq;
---DROP SEQUENCE IF EXISTS sessions_id_seq;
---DROP SEQUENCE IF EXISTS tracks_id_seq;

--- Create sequences

CREATE SEQUENCE drivers_id_seq INCREMENT 1 START 1;
CREATE SEQUENCE records_id_seq INCREMENT 1 START 1;
CREATE SEQUENCE sessions_id_seq INCREMENT 1 START 1;
CREATE SEQUENCE tracks_id_seq INCREMENT 1 START 1;

CREATE TABLE public.drivers
(
    "id" integer NOT NULL DEFAULT nextval('drivers_id_seq'::regclass),    
    "name" character varying COLLATE pg_catalog."default",
    "order" integer,        
    CONSTRAINT drivers_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.drivers OWNER to postgres;

-- Table: public.tracks

-- DROP TABLE public.tracks;

CREATE TABLE public.tracks
(
    id integer NOT NULL DEFAULT nextval('tracks_id_seq'::regclass),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tracks_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tracks OWNER to postgres;

-- Table: public.sessions

-- DROP TABLE public.sessions;

CREATE TABLE public.sessions
(
    id integer NOT NULL DEFAULT nextval('sessions_id_seq'::regclass),
    "time" bigint,
    tracks_id integer,
    CONSTRAINT session_pkey PRIMARY KEY (id),
    CONSTRAINT track_fk FOREIGN KEY (tracks_id)
        REFERENCES public.tracks (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH ( OIDS = FALSE )
TABLESPACE pg_default;

ALTER TABLE public.sessions OWNER to postgres;    



-- Table: public.records

-- DROP TABLE public.records;

CREATE TABLE public.records
(
  id integer NOT NULL DEFAULT nextval('records_id_seq'::regclass),
    "time" double precision,
    drivers_id integer,
    sessions_id integer,    
    CONSTRAINT records_pkey PRIMARY KEY (id),
    CONSTRAINT drivers_fk FOREIGN KEY (drivers_id)
        REFERENCES public.drivers (id) MATCH SIMPLE,  
    CONSTRAINT session_fk FOREIGN KEY (sessions_id)
        REFERENCES public.sessions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH ( OIDS = FALSE )
TABLESPACE pg_default;

ALTER TABLE public.records OWNER to postgres;


INSERT INTO drivers("name", "order" ) VALUES ('Teemu', 1);
INSERT INTO drivers("name", "order" ) VALUES ('Toni', 2);
INSERT INTO drivers("name", "order" ) VALUES ('Tatu', 3);

INSERT INTO tracks("name") VALUES ('Uphill Battle');
INSERT INTO sessions(time, track_id) VALUES (166755690000, (SELECT currval('tracks_id_seq')));--"2022-11-04 12:15:00"
INSERT INTO records ("time", "drivers_id", "sessions_id") VALUES (123.3, 1, (SELECT currval('sessions_id_seq')));
INSERT INTO records ("time", "drivers_id", "sessions_id") VALUES (133.3, 2, (SELECT currval('sessions_id_seq')));
INSERT INTO records ("time", "drivers_id", "sessions_id") VALUES (143.3, 3, (SELECT currval('sessions_id_seq')));

INSERT INTO sessions(time, track_id) VALUES (1667470800000, (SELECT currval('tracks_id_seq')));--"2022-11-03 12:20:00"
INSERT INTO records ("time", "drivers_id", "sessions_id") VALUES (123.3, 2, (SELECT currval('sessions_id_seq')));
INSERT INTO records ("time", "drivers_id", "sessions_id") VALUES (143.3, 3, (SELECT currval('sessions_id_seq')));


INSERT INTO tracks("name") VALUES ('Beach Race');
INSERT INTO sessions(time, track_id) VALUES (1667650500000, (SELECT currval('tracks_id_seq')));--"2022-11-05 14:15:00"
INSERT INTO records ("time", "drivers_id", "sessions_id") VALUES (200.3, 1, (SELECT currval('sessions_id_seq')));
INSERT INTO records ("time", "drivers_id", "sessions_id") VALUES (250.3, 2, (SELECT currval('sessions_id_seq')));
INSERT INTO records ("time", "drivers_id", "sessions_id") VALUES (243.3, 3, (SELECT currval('sessions_id_seq')));

--TRUNCATE TABLE records;
--TRUNCATE TABLE sessions;
--TRUNCATE TABLE tracks;
--TRUNCATE TABLE drivers;

--DROP TABLE public.records;
--DROP TABLE public.sessions;
--DROP TABLE public.tracks;
--DROP TABLE public.drivers;
