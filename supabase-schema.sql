-- BRT Dashboard Supabase Tables

-- Bus routes master table
CREATE TABLE IF NOT EXISTS routes (
  id BIGSERIAL PRIMARY KEY,
  route_name TEXT NOT NULL UNIQUE,
  route_code TEXT UNIQUE,
  start_point TEXT,
  end_point TEXT,
  distance_km NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real-time bus data snapshots (time-series)
CREATE TABLE IF NOT EXISTS bus_snapshots (
  id BIGSERIAL PRIMARY KEY,
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bus_id TEXT NOT NULL,
  route TEXT NOT NULL,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  speed NUMERIC(5, 2),
  passengers INTEGER DEFAULT 0,
  delay INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delay metrics aggregated by route
CREATE TABLE IF NOT EXISTS delay_metrics (
  id BIGSERIAL PRIMARY KEY,
  route TEXT NOT NULL,
  metric_date DATE NOT NULL,
  avg_delay NUMERIC(6, 2),
  max_delay INTEGER,
  min_delay INTEGER,
  total_records INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(route, metric_date)
);

-- Passenger fluctuation history
CREATE TABLE IF NOT EXISTS passenger_metrics (
  id BIGSERIAL PRIMARY KEY,
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bus_id TEXT NOT NULL,
  route TEXT NOT NULL,
  passenger_count INTEGER,
  capacity_percentage NUMERIC(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bus_snapshots_recorded_at ON bus_snapshots(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_bus_snapshots_route ON bus_snapshots(route);
CREATE INDEX IF NOT EXISTS idx_bus_snapshots_bus_id ON bus_snapshots(bus_id);
CREATE INDEX IF NOT EXISTS idx_delay_metrics_date ON delay_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_passenger_metrics_recorded_at ON passenger_metrics(recorded_at DESC);

-- Enable Row Level Security
ALTER TABLE bus_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE delay_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE passenger_metrics ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (adjust as needed for security)
CREATE POLICY "Allow public read on bus_snapshots" 
  ON bus_snapshots FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read on delay_metrics" 
  ON delay_metrics FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read on passenger_metrics" 
  ON passenger_metrics FOR SELECT 
  USING (true);

-- Create a policy to allow service role writes (for API)
CREATE POLICY "Allow service role insert on bus_snapshots"
  ON bus_snapshots FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role insert on delay_metrics"
  ON delay_metrics FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role insert on passenger_metrics"
  ON passenger_metrics FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
