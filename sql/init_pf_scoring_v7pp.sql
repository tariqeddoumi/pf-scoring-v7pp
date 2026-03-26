-- PF Scoring Studio V7++
-- PostgreSQL initialization script
-- Create a dedicated database manually if needed:
-- CREATE DATABASE pf_scoring_v7pp;

CREATE TABLE IF NOT EXISTS app_user (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role_code TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project (
    id TEXT PRIMARY KEY,
    project_code TEXT NOT NULL UNIQUE,
    project_name TEXT NOT NULL,
    client_radical TEXT,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    project_type TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MAD',
    total_cost_mad NUMERIC(18,2) NOT NULL,
    requested_debt_mad NUMERIC(18,2) NOT NULL,
    equity_mad NUMERIC(18,2) NOT NULL,
    sponsor_name TEXT,
    offtaker_name TEXT,
    epc_name TEXT,
    om_operator_name TEXT,
    stage TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bam_classification') THEN
        CREATE TYPE bam_classification AS ENUM (
            'HEALTHY',
            'WATCH',
            'SENSITIVE',
            'SUBSTANDARD',
            'DOUBTFUL',
            'LOSS'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS evaluation (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    created_by_id TEXT REFERENCES app_user(id),
    evaluation_date TIMESTAMP NOT NULL DEFAULT NOW(),
    classification_bam bam_classification NOT NULL,
    pre_adjustment_score NUMERIC(7,2) NOT NULL,
    final_score NUMERIC(7,2) NOT NULL,
    final_grade TEXT NOT NULL,
    approved BOOLEAN NOT NULL,
    commentary TEXT,
    raw_payload_json TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evaluation_project_date
    ON evaluation(project_id, evaluation_date DESC);

CREATE TABLE IF NOT EXISTS evaluation_domain_score (
    id TEXT PRIMARY KEY,
    evaluation_id TEXT NOT NULL REFERENCES evaluation(id) ON DELETE CASCADE,
    domain_code TEXT NOT NULL,
    domain_name TEXT NOT NULL,
    weight NUMERIC(6,4) NOT NULL,
    raw_score NUMERIC(7,2) NOT NULL,
    weighted_score NUMERIC(7,2) NOT NULL,
    red_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_domain_score_evaluation
    ON evaluation_domain_score(evaluation_id);

CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES app_user(id),
    evaluation_id TEXT REFERENCES evaluation(id),
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    before_json TEXT,
    after_json TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_entity
    ON audit_log(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS lookup_value (
    id TEXT PRIMARY KEY,
    lookup_group TEXT NOT NULL,
    code TEXT NOT NULL,
    label TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_lookup UNIQUE (lookup_group, code)
);

INSERT INTO lookup_value (id, lookup_group, code, label, sort_order, is_active)
VALUES
    ('lkp-city-casa', 'CITY', 'CASABLANCA', 'Casablanca', 1, TRUE),
    ('lkp-city-rabat', 'CITY', 'RABAT', 'Rabat', 2, TRUE),
    ('lkp-city-tanger', 'CITY', 'TANGER', 'Tanger', 3, TRUE),
    ('lkp-type-energy', 'PROJECT_TYPE', 'ENERGY', 'Énergie', 1, TRUE),
    ('lkp-type-infra', 'PROJECT_TYPE', 'INFRA', 'Infrastructure', 2, TRUE),
    ('lkp-type-industry', 'PROJECT_TYPE', 'INDUSTRY', 'Industrie', 3, TRUE)
ON CONFLICT DO NOTHING;
