--CREATE TABLES

CREATE SEQUENCE drivers_id_seq;
CREATE SEQUENCE records_id_seq;
CREATE SEQUENCE sessions_id_seq;
CREATE SEQUENCE tracks_id_seq;

CREATE TABLE drivers (
    id integer DEFAULT nextval('drivers_id_seq'::regclass) NOT NULL,
    name character varying,
    "order" integer
);

CREATE TABLE records (
    id integer DEFAULT nextval('records_id_seq'::regclass) NOT NULL,
    "time" double precision,
    drivers_id integer NOT NULL,
    sessions_id integer NOT NULL
);

CREATE TABLE sessions (
    id integer DEFAULT nextval('sessions_id_seq'::regclass) NOT NULL,
    "time" bigint,
    tracks_id integer NOT NULL,
    deleted boolean DEFAULT false
);

CREATE TABLE tracks (
    id integer DEFAULT nextval('tracks_id_seq'::regclass) NOT NULL,
    name character varying NOT NULL
);

ALTER TABLE ONLY drivers ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY records ADD CONSTRAINT records_pkey PRIMARY KEY (id);
ALTER TABLE ONLY sessions ADD CONSTRAINT session_pkey PRIMARY KEY (id);
ALTER TABLE ONLY tracks ADD CONSTRAINT tracks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY records ADD CONSTRAINT unique_session_and_driver UNIQUE (sessions_id, drivers_id);
ALTER TABLE ONLY records ADD CONSTRAINT drivers_fk FOREIGN KEY (drivers_id) REFERENCES drivers(id);
ALTER TABLE ONLY records ADD CONSTRAINT session_fk FOREIGN KEY (sessions_id) REFERENCES sessions(id);
ALTER TABLE ONLY sessions ADD CONSTRAINT track_fk FOREIGN KEY (tracks_id) REFERENCES tracks(id);

--- Migration 2022-11-10 ---

CREATE SEQUENCE cars_id_seq;

CREATE TABLE cars (
    id integer DEFAULT nextval('cars_id_seq'::regclass) NOT NULL,
    name character varying,
    scores integer NOT NULL DEFAULT 0,
    drivers_id integer NOT NULL,
    deleted boolean DEFAULT false
);

ALTER TABLE cars ADD CONSTRAINT id PRIMARY KEY (id);

-- Can be null not forced to be filled --
ALTER TABLE records ADD COLUMN cars_id integer;


-- New foreign keys --
ALTER TABLE ONLY records ADD CONSTRAINT records_cars_fk FOREIGN KEY (cars_id) REFERENCES cars(id);
ALTER TABLE ONLY cars ADD CONSTRAINT cars_drivers_fk FOREIGN KEY (drivers_id) REFERENCES drivers(id);
ALTER TABLE ONLY tracks ADD CONSTRAINT track_name_uniq UNIQUE (name);

ALTER TABLE ONLY records DROP CONSTRAINT unique_session_and_driver;
ALTER TABLE ONLY records DROP CONSTRAINT session_fk;
ALTER TABLE ONLY sessions DROP CONSTRAINT track_fk;
ALTER TABLE ONLY records DROP COLUMN sessions_id;


TRUNCATE TABLE records;
TRUNCATE TABLE sessions;
TRUNCATE TABLE tracks;

ALTER TABLE ONLY records ADD tracks_id integer NOT NULL;
ALTER TABLE ONLY records ADD CONSTRAINT track_fk FOREIGN KEY (tracks_id) REFERENCES tracks(id);

ALTER TABLE ONLY tracks ADD COLUMN description character varying;
ALTER TABLE ONLY tracks ADD COLUMN deleted boolean DEFAULT false;
ALTER TABLE ONLY records ADD COLUMN deleted boolean DEFAULT false;

DROP TABLE sessions;