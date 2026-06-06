-- Crear tabla de categorías predefinidas
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon TEXT DEFAULT '📁',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insertar categorías por defecto
INSERT INTO categories (name, type, icon) VALUES
  ('Salario', 'income', '💰'),
  ('Freelance', 'income', '💻'),
  ('Inversiones', 'income', '📈'),
  ('Ventas', 'income', '🛒'),
  ('Otros ingresos', 'income', '📥'),
  ('Alimentación', 'expense', '🍽️'),
  ('Transporte', 'expense', '🚗'),
  ('Vivienda', 'expense', '🏠'),
  ('Servicios', 'expense', '💡'),
  ('Salud', 'expense', '🏥'),
  ('Entretenimiento', 'expense', '🎬'),
  ('Educación', 'expense', '📚'),
  ('Ropa', 'expense', '👕'),
  ('Otros gastos', 'expense', '📤');

-- Crear tabla de transacciones
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  description TEXT DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para mejorar performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);

-- Habilitar Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para categories (todos pueden leer, solo admin escribe)
CREATE POLICY "Everyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);
