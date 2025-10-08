-- Seed data for ACEROMAX e-commerce
-- Productos de aceros y materiales de construcción

-- Primero, crear un seller de sistema (ACEROMAX oficial)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'sistema@aceromax.ec',
  crypt('AceroMax2025!', gen_salt('bf')),
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Crear perfil del seller
INSERT INTO profiles (id, first_name, last_name, phone, is_seller, is_verified, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ACEROMAX',
  'Oficial',
  '+593-2-123-4567',
  true,
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Crear seller
INSERT INTO sellers (id, user_id, business_name, business_email, business_phone, description, business_address, is_verified, is_active, rating, commission_rate)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'ACEROMAX Oficial',
  'ventas@aceromax.ec',
  '+593-2-123-4567',
  'Distribuidor líder en Ecuador de aceros y materiales de construcción. 25+ años de experiencia.',
  'Av. Panamericana Norte Km 14, Quito - Ecuador',
  true,
  true,
  4.8,
  0
)
ON CONFLICT (id) DO NOTHING;

-- Limpiar categorías existentes y crear nuevas específicas para aceros
DELETE FROM categories;

-- Categorías principales de aceros
INSERT INTO categories (id, name, slug, description, parent_id, sort_order, is_active) VALUES
('c1000000-0000-0000-0000-000000000001', 'Varillas', 'varillas', 'Varillas de acero corrugadas y lisas para construcción', NULL, 1, true),
('c1000000-0000-0000-0000-000000000002', 'Perfiles', 'perfiles', 'Perfiles estructurales de acero: ángulos, canales, UPN', NULL, 2, true),
('c1000000-0000-0000-0000-000000000003', 'Vigas', 'vigas', 'Vigas de acero IPE, IPN, HEB para estructuras', NULL, 3, true),
('c1000000-0000-0000-0000-000000000004', 'Láminas', 'laminas', 'Láminas de acero lisas, corrugadas y galvanizadas', NULL, 4, true),
('c1000000-0000-0000-0000-000000000005', 'Tubos', 'tubos', 'Tubos y cañerías de acero cuadrados y redondos', NULL, 5, true),
('c1000000-0000-0000-0000-000000000006', 'Mallas', 'mallas', 'Mallas electrosoldadas y de construcción', NULL, 6, true),
('c1000000-0000-0000-0000-000000000007', 'Alambres', 'alambres', 'Alambres de acero recocido y galvanizado', NULL, 7, true),
('c1000000-0000-0000-0000-000000000008', 'Accesorios', 'accesorios', 'Accesorios y herramientas para construcción', NULL, 8, true);

-- Subcategorías de Varillas
INSERT INTO categories (id, name, slug, description, parent_id, sort_order, is_active) VALUES
('c2000000-0000-0000-0000-000000000001', 'Varillas Corrugadas', 'varillas-corrugadas', 'Varillas con nervaduras para mejor adherencia', 'c1000000-0000-0000-0000-000000000001', 1, true),
('c2000000-0000-0000-0000-000000000002', 'Varillas Lisas', 'varillas-lisas', 'Varillas de superficie lisa', 'c1000000-0000-0000-0000-000000000001', 2, true);

-- Subcategorías de Perfiles  
INSERT INTO categories (id, name, slug, description, parent_id, sort_order, is_active) VALUES
('c2000000-0000-0000-0000-000000000003', 'Perfiles L (Ángulos)', 'perfiles-angulos', 'Perfiles en forma de L', 'c1000000-0000-0000-0000-000000000002', 1, true),
('c2000000-0000-0000-0000-000000000004', 'Perfiles U (Canales)', 'perfiles-canales', 'Perfiles en forma de U', 'c1000000-0000-0000-0000-000000000002', 2, true);

-- Productos de Varillas Corrugadas
INSERT INTO products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, weight, is_active, is_featured, tags)
VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  'Varilla Corrugada 8mm (5/16") - 12m',
  'varilla-corrugada-8mm',
  'Varilla de acero corrugada de 8mm de diámetro y 12 metros de longitud. Cumple con normas ASTM A615. Ideal para losas, columnas y estructuras ligeras. Resistencia de 4200 kg/cm². Superficie con nervaduras para mejor adherencia con el concreto.',
  'Varilla corrugada 8mm para construcción, 12m de largo',
  'VAR-COR-8MM-12M',
  4.50,
  5.20,
  5000,
  5.96,
  true,
  true,
  ARRAY['varilla', 'corrugada', '8mm', 'construcción', 'acero']
),
(
  'p1000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  'Varilla Corrugada 10mm (3/8") - 12m',
  'varilla-corrugada-10mm',
  'Varilla de acero corrugada de 10mm de diámetro y 12 metros de longitud. Cumple con normas ASTM A615. Ampliamente utilizada en construcción residencial y comercial. Resistencia de 4200 kg/cm². Excelente relación peso-resistencia.',
  'Varilla corrugada 10mm, uso general en construcción',
  'VAR-COR-10MM-12M',
  6.80,
  7.50,
  4500,
  7.40,
  true,
  true,
  ARRAY['varilla', 'corrugada', '10mm', '3/8', 'construcción']
),
(
  'p1000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  'Varilla Corrugada 12mm (1/2") - 12m',
  'varilla-corrugada-12mm',
  'Varilla de acero corrugada de 12mm de diámetro y 12 metros de longitud. La más popular en construcción. Cumple con normas ASTM A615. Ideal para columnas, vigas y cimentaciones. Resistencia de 4200 kg/cm². Alta durabilidad.',
  'Varilla corrugada 12mm, la más utilizada',
  'VAR-COR-12MM-12M',
  8.50,
  9.80,
  6000,
  8.88,
  true,
  true,
  ARRAY['varilla', 'corrugada', '12mm', '1/2', 'bestseller']
),
(
  'p1000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  'Varilla Corrugada 16mm (5/8") - 12m',
  'varilla-corrugada-16mm',
  'Varilla de acero corrugada de 16mm de diámetro y 12 metros de longitud. Para estructuras que requieren mayor resistencia. Cumple con normas ASTM A615. Perfecta para vigas principales y columnas de gran altura.',
  'Varilla corrugada 16mm para estructuras reforzadas',
  'VAR-COR-16MM-12M',
  15.20,
  17.00,
  3000,
  15.76,
  true,
  false,
  ARRAY['varilla', 'corrugada', '16mm', '5/8', 'reforzado']
);

-- Productos de Perfiles
INSERT INTO products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, weight, is_active, is_featured, tags)
VALUES
(
  'p1000000-0000-0000-0000-000000000005',
  '10000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000003',
  'Perfil L 50x50x5mm - 6m',
  'perfil-l-50x50x5mm',
  'Perfil angular (L) de 50x50mm con espesor de 5mm. Longitud de 6 metros. Acero estructural A36. Ideal para marcos, estructuras ligeras, rejas y soportes. Superficie con protección anticorrosiva. Fácil de soldar y cortar.',
  'Perfil angular 50x50x5mm para estructuras',
  'PER-L-50X50X5-6M',
  15.20,
  18.00,
  2000,
  11.6,
  true,
  true,
  ARRAY['perfil', 'angular', 'L', '50x50', 'estructural']
),
(
  'p1000000-0000-0000-0000-000000000006',
  '10000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000003',
  'Perfil L 75x75x6mm - 6m',
  'perfil-l-75x75x6mm',
  'Perfil angular (L) de 75x75mm con espesor de 6mm. Longitud de 6 metros. Acero estructural A36. Mayor resistencia para estructuras medianas. Excelente para torres, soportes y refuerzos estructurales.',
  'Perfil angular 75x75x6mm reforzado',
  'PER-L-75X75X6-6M',
  28.50,
  32.00,
  1500,
  21.4,
  true,
  false,
  ARRAY['perfil', 'angular', 'L', '75x75', 'reforzado']
);

-- Productos de Vigas
INSERT INTO products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, weight, is_active, is_featured, tags)
VALUES
(
  'p1000000-0000-0000-0000-000000000007',
  '10000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000003',
  'Viga IPE 160mm - 6m',
  'viga-ipe-160mm',
  'Viga de acero tipo IPE 160mm de altura. Longitud de 6 metros. Acero estructural S275JR. Perfil en forma de I con alas paralelas. Ideal para entrepisos, techos y estructuras industriales. Alta capacidad de carga y resistencia a flexión.',
  'Viga IPE 160mm para entrepisos y techos',
  'VIG-IPE-160-6M',
  45.00,
  52.00,
  800,
  62.4,
  true,
  true,
  ARRAY['viga', 'IPE', '160mm', 'estructural', 'industrial']
),
(
  'p1000000-0000-0000-0000-000000000008',
  '10000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000003',
  'Viga IPE 200mm - 6m',
  'viga-ipe-200mm',
  'Viga de acero tipo IPE 200mm de altura. Longitud de 6 metros. Acero estructural S275JR. Mayor capacidad de carga que el IPE 160. Perfecta para luces grandes y cargas pesadas. Ampliamente utilizada en construcción industrial.',
  'Viga IPE 200mm para grandes luces',
  'VIG-IPE-200-6M',
  68.00,
  75.00,
  600,
  88.8,
  true,
  false,
  ARRAY['viga', 'IPE', '200mm', 'industrial', 'carga-pesada']
);

-- Productos de Láminas
INSERT INTO products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, weight, is_active, is_featured, tags)
VALUES
(
  'p1000000-0000-0000-0000-000000000009',
  '10000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000004',
  'Lámina Galvanizada Lisa 1.2mm - 1.22x2.44m',
  'lamina-galvanizada-1.2mm',
  'Lámina de acero galvanizado lisa de 1.2mm de espesor. Dimensiones 1.22 x 2.44 metros. Recubrimiento de zinc para resistencia a la corrosión. Ideal para cubiertas, cerramientos y ductos. Fácil de instalar y mantener.',
  'Lámina galvanizada 1.2mm para cubiertas',
  'LAM-GAL-1.2MM-122X244',
  28.00,
  32.00,
  1200,
  28.5,
  true,
  true,
  ARRAY['lámina', 'galvanizada', 'lisa', 'cubierta', 'anticorrosiva']
),
(
  'p1000000-0000-0000-0000-000000000010',
  '10000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000004',
  'Lámina Corrugada Galvanizada 0.35mm - 0.90x3.66m',
  'lamina-corrugada-galvanizada',
  'Lámina corrugada galvanizada de 0.35mm de espesor. Dimensiones 0.90 x 3.66 metros. Acanalada tipo trapezoidal. Excelente para techos residenciales e industriales. Alta resistencia al clima. Fácil instalación.',
  'Lámina corrugada galvanizada para techos',
  'LAM-COR-GAL-0.35MM',
  22.50,
  25.00,
  2000,
  9.8,
  true,
  false,
  ARRAY['lámina', 'corrugada', 'galvanizada', 'techo', 'clima']
);

-- Productos de Tubos
INSERT INTO products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, weight, is_active, is_featured, tags)
VALUES
(
  'p1000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000005',
  'Tubo Cuadrado 40x40x2mm - 6m',
  'tubo-cuadrado-40x40',
  'Tubo estructural cuadrado 40x40mm con espesor de pared de 2mm. Longitud de 6 metros. Acero al carbono. Ideal para estructuras, barandas, rejas y muebles metálicos. Alta resistencia y versatilidad.',
  'Tubo cuadrado 40x40x2mm estructural',
  'TUB-CUA-40X40X2-6M',
  18.50,
  21.00,
  1800,
  14.2,
  true,
  false,
  ARRAY['tubo', 'cuadrado', '40x40', 'estructural', 'versátil']
),
(
  'p1000000-0000-0000-0000-000000000012',
  '10000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000005',
  'Tubo Redondo Negro 1" SCH40 - 6m',
  'tubo-redondo-1-pulgada',
  'Tubo redondo de 1 pulgada Schedule 40. Longitud de 6 metros. Acero al carbono sin costura. Para instalaciones industriales, hidráulicas y estructurales. Alta presión de trabajo. Norma ASTM A53.',
  'Tubo redondo 1" Schedule 40',
  'TUB-RED-1IN-SCH40-6M',
  24.00,
  27.00,
  1200,
  19.8,
  true,
  false,
  ARRAY['tubo', 'redondo', '1 pulgada', 'SCH40', 'industrial']
);

-- Productos de Mallas
INSERT INTO products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, weight, is_active, is_featured, tags)
VALUES
(
  'p1000000-0000-0000-0000-000000000013',
  '10000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000006',
  'Malla Electrosoldada 15x15cm - 6x2.35m',
  'malla-electrosoldada-15x15',
  'Malla electrosoldada con cuadrícula de 15x15cm. Panel de 6 x 2.35 metros. Alambre de 4.5mm de diámetro. Ideal para losas, pisos industriales y cimentaciones. Ahorra tiempo de instalación comparado con varillas.',
  'Malla electrosoldada 15x15cm para losas',
  'MAL-ELE-15X15-6X235',
  35.00,
  40.00,
  800,
  52.0,
  true,
  false,
  ARRAY['malla', 'electrosoldada', '15x15', 'losa', 'refuerzo']
);

-- Productos de Accesorios
INSERT INTO products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, weight, is_active, is_featured, tags)
VALUES
(
  'p1000000-0000-0000-0000-000000000014',
  '10000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000008',
  'Alambre Recocido #18 - Rollo 50kg',
  'alambre-recocido-18',
  'Alambre de acero recocido calibre #18. Rollo de 50kg. Material suave y maleable. Para amarres de varillas, cercas y trabajos generales de construcción. Fácil de manipular y torcer.',
  'Alambre recocido #18 para amarres',
  'ALA-REC-18-50KG',
  85.00,
  95.00,
  500,
  50.0,
  true,
  false,
  ARRAY['alambre', 'recocido', '#18', 'amarre', 'construcción']
),
(
  'p1000000-0000-0000-0000-000000000015',
  '10000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000008',
  'Electrodos 6011 - 1/8" (Caja 5kg)',
  'electrodos-6011-1-8',
  'Electrodos para soldadura 6011 de 1/8 pulgada. Caja de 5kg (aprox. 160 electrodos). Versatiles para todo tipo de posiciones. Ideales para acero al carbono. Arco estable y fácil encendido.',
  'Electrodos 6011 1/8" caja 5kg',
  'ELE-6011-1/8-5KG',
  42.00,
  48.00,
  600,
  5.0,
  true,
  false,
  ARRAY['electrodo', '6011', 'soldadura', 'acero', 'construcción']
);

-- Agregar algunas imágenes placeholder (URLs de ejemplo)
-- En producción, estas deberían ser URLs reales de imágenes
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
('p1000000-0000-0000-0000-000000000001', 'https://placeholder.com/varilla-8mm.jpg', 'Varilla Corrugada 8mm', 1, true),
('p1000000-0000-0000-0000-000000000002', 'https://placeholder.com/varilla-10mm.jpg', 'Varilla Corrugada 10mm', 1, true),
('p1000000-0000-0000-0000-000000000003', 'https://placeholder.com/varilla-12mm.jpg', 'Varilla Corrugada 12mm', 1, true),
('p1000000-0000-0000-0000-000000000005', 'https://placeholder.com/perfil-l-50.jpg', 'Perfil L 50x50x5mm', 1, true),
('p1000000-0000-0000-0000-000000000007', 'https://placeholder.com/viga-ipe-160.jpg', 'Viga IPE 160mm', 1, true),
('p1000000-0000-0000-0000-000000000009', 'https://placeholder.com/lamina-galv.jpg', 'Lámina Galvanizada', 1, true);

-- Agregar atributos a los productos
INSERT INTO product_attributes (product_id, name, value) VALUES
('p1000000-0000-0000-0000-000000000001', 'Diámetro', '8mm (5/16")'),
('p1000000-0000-0000-0000-000000000001', 'Longitud', '12 metros'),
('p1000000-0000-0000-0000-000000000001', 'Peso por metro', '0.497 kg/m'),
('p1000000-0000-0000-0000-000000000001', 'Resistencia', '4200 kg/cm²'),
('p1000000-0000-0000-0000-000000000001', 'Norma', 'ASTM A615'),
('p1000000-0000-0000-0000-000000000003', 'Diámetro', '12mm (1/2")'),
('p1000000-0000-0000-0000-000000000003', 'Longitud', '12 metros'),
('p1000000-0000-0000-0000-000000000003', 'Peso por metro', '0.888 kg/m'),
('p1000000-0000-0000-0000-000000000003', 'Resistencia', '4200 kg/cm²'),
('p1000000-0000-0000-0000-000000000003', 'Norma', 'ASTM A615'),
('p1000000-0000-0000-0000-000000000005', 'Dimensiones', '50 x 50 x 5 mm'),
('p1000000-0000-0000-0000-000000000005', 'Longitud', '6 metros'),
('p1000000-0000-0000-0000-000000000005', 'Peso por metro', '3.71 kg/m'),
('p1000000-0000-0000-0000-000000000005', 'Material', 'Acero A36'),
('p1000000-0000-0000-0000-000000000007', 'Altura', '160 mm'),
('p1000000-0000-0000-0000-000000000007', 'Longitud', '6 metros'),
('p1000000-0000-0000-0000-000000000007', 'Peso por metro', '15.8 kg/m'),
('p1000000-0000-0000-0000-000000000007', 'Material', 'Acero S275JR'),
('p1000000-0000-0000-0000-000000000009', 'Espesor', '1.2 mm'),
('p1000000-0000-0000-0000-000000000009', 'Dimensiones', '1.22 x 2.44 m'),
('p1000000-0000-0000-0000-000000000009', 'Acabado', 'Galvanizado');

-- Agregar algunas reseñas de ejemplo
INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved) VALUES
('p1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 5, 'Excelente calidad', 'La varilla de 12mm es de muy buena calidad. Llegó en perfectas condiciones y cumple con las especificaciones. La recomiendo.', true, true),
('p1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 5, 'Muy resistente', 'Perfecto para mi proyecto de construcción. La resistencia es la adecuada y el precio excelente.', true, true),
('p1000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 5, 'Perfecto para estructuras', 'El perfil angular es muy versátil. Lo usé para una estructura de soporte y quedó excelente.', true, true),
('p1000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 4, 'Buena viga', 'La viga IPE 160 es de buena calidad, aunque el acabado podría mejorar un poco. En general satisfecho.', true, true);

