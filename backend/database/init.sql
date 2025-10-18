-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Insert sample data for testing
INSERT INTO orders (customer_name, item, quantity, status) VALUES
('John Doe', 'Laptop', 2, 'pending'),
('Jane Smith', 'Mouse', 5, 'completed'),
('Bob Johnson', 'Keyboard', 1, 'cancelled'),
('Alice Wilson', 'Monitor', 3, 'pending'),
('Charlie Brown', 'Webcam', 1, 'completed');
