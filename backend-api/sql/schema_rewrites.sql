CREATE TABLE IF NOT EXISTS route_rewrites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(500) NOT NULL,
    destination VARCHAR(500) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    description VARCHAR(255) DEFAULT NULL
);

INSERT INTO route_rewrites (source, destination, is_active, sort_order, description) VALUES
('/_api/v1/:path*', '/:path*', 1, 1, 'Lovable dev tool prefix strip'),
('/_next/v1/:path*', '/:path*', 1, 2, 'Next.js internal prefix strip fallback');
