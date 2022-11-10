﻿--CREATE TABLES

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