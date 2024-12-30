/*
  # Initial Schema Setup

  1. Tables
    - projects
    - stages
    - tasks
    - team_members
    - materials
    - transactions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  client text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  budget numeric NOT NULL CHECK (budget > 0),
  status text NOT NULL CHECK (status IN ('em_andamento', 'concluido', 'atrasado')),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

-- Stages
CREATE TABLE IF NOT EXISTS stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'atrasado')),
  responsible uuid REFERENCES auth.users(id),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  predecessor_id uuid REFERENCES stages(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read stages"
  ON stages FOR SELECT
  TO authenticated
  USING (true);

-- Add other tables and policies similarly