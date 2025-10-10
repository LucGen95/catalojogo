--
-- PostgreSQL database dump
--

--\restrict QYxFnOoGCMRVSudXwl2aHm88w2uynvjnJ5YqexF1pegRNbxAD8jHwcL8tmzTnHx

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-09 18:18:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

--CREATE SCHEMA public;


--ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16424)
-- Name: game_genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_genre (
    game_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.game_genre OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16439)
-- Name: game_platform; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_platform (
    game_id integer NOT NULL,
    platform_id integer NOT NULL
);


ALTER TABLE public.game_platform OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16398)
-- Name: games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.games (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    release_date date,
    developer character varying(150),
    publisher character varying(150),
    cover_url character varying(500)
);


ALTER TABLE public.games OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16397)
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.games_id_seq OWNER TO postgres;

--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 217
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- TOC entry 220 (class 1259 OID 16407)
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16406)
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genres_id_seq OWNER TO postgres;

--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 219
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- TOC entry 222 (class 1259 OID 16416)
-- Name: platforms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platforms (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.platforms OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16415)
-- Name: platforms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.platforms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.platforms_id_seq OWNER TO postgres;

--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 221
-- Name: platforms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.platforms_id_seq OWNED BY public.platforms.id;


--
-- TOC entry 4713 (class 2604 OID 16401)
-- Name: games id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- TOC entry 4714 (class 2604 OID 16410)
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- TOC entry 4715 (class 2604 OID 16419)
-- Name: platforms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platforms ALTER COLUMN id SET DEFAULT nextval('public.platforms_id_seq'::regclass);


--
-- TOC entry 4885 (class 0 OID 16424)
-- Dependencies: 223
-- Data for Name: game_genre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_genre (game_id, genre_id) FROM stdin;
\.


--
-- TOC entry 4886 (class 0 OID 16439)
-- Dependencies: 224
-- Data for Name: game_platform; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_platform (game_id, platform_id) FROM stdin;
\.


--
-- TOC entry 4880 (class 0 OID 16398)
-- Dependencies: 218
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.games (id, title, description, release_date, developer, publisher, cover_url) FROM stdin;
\.


--
-- TOC entry 4882 (class 0 OID 16407)
-- Dependencies: 220
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (id, name) FROM stdin;
\.


--
-- TOC entry 4884 (class 0 OID 16416)
-- Dependencies: 222
-- Data for Name: platforms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platforms (id, name) FROM stdin;
\.


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 217
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_id_seq', 1, false);


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 219
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_id_seq', 1, false);


--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 221
-- Name: platforms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.platforms_id_seq', 1, false);


--
-- TOC entry 4727 (class 2606 OID 16428)
-- Name: game_genre game_genre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_genre
    ADD CONSTRAINT game_genre_pkey PRIMARY KEY (game_id, genre_id);


--
-- TOC entry 4729 (class 2606 OID 16443)
-- Name: game_platform game_platform_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_platform
    ADD CONSTRAINT game_platform_pkey PRIMARY KEY (game_id, platform_id);


--
-- TOC entry 4717 (class 2606 OID 16405)
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- TOC entry 4719 (class 2606 OID 16414)
-- Name: genres genres_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_name_key UNIQUE (name);


--
-- TOC entry 4721 (class 2606 OID 16412)
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- TOC entry 4723 (class 2606 OID 16423)
-- Name: platforms platforms_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_name_key UNIQUE (name);


--
-- TOC entry 4725 (class 2606 OID 16421)
-- Name: platforms platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_pkey PRIMARY KEY (id);


--
-- TOC entry 4730 (class 2606 OID 16429)
-- Name: game_genre game_genre_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_genre
    ADD CONSTRAINT game_genre_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;


--
-- TOC entry 4731 (class 2606 OID 16434)
-- Name: game_genre game_genre_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_genre
    ADD CONSTRAINT game_genre_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;


--
-- TOC entry 4732 (class 2606 OID 16444)
-- Name: game_platform game_platform_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_platform
    ADD CONSTRAINT game_platform_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;


--
-- TOC entry 4733 (class 2606 OID 16449)
-- Name: game_platform game_platform_platform_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_platform
    ADD CONSTRAINT game_platform_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;


-- Completed on 2025-10-09 18:18:05

--
-- PostgreSQL database dump complete
--

--\unrestrict QYxFnOoGCMRVSudXwl2aHm88w2uynvjnJ5YqexF1pegRNbxAD8jHwcL8tmzTnHx

