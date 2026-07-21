-- ============================================
-- 批量插入第二批新信贷机构 (20个)
-- 数据来源：点点数据 App Store 墨西哥区财务榜 + App Store验证
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================

INSERT INTO institutions (name, slug, type, description, website_url, rating, review_count, complaint_count, is_verified) VALUES
-- 1. Citibanamex (免费榜 rank 99)
('Citibanamex', 'citibanamex', 'bank', 'Uno de los bancos más grandes de México, parte de Citigroup. Ofrece tarjetas de crédito, préstamos personales, hipotecas, inversión y servicios financieros completos con respaldo internacional.', 'https://www.banamex.com', 0, 0, 0, true),
-- 2. Banorte (免费榜 rank 107)
('Banorte', 'banorte', 'bank', 'Banco mexicano con más de 120 años de historia. Ofrece tarjetas de crédito, préstamos personales, hipotecas, inversión, seguros y servicios financieros para personas y empresas.', 'https://www.banorte.com', 0, 0, 0, true),
-- 3. Préstala (免费榜 rank 155)
('Préstala', 'prestala', 'sofom', 'Plataforma digital de préstamos personales que conecta usuarios con opciones de crédito sin garantía. Proceso 100% en línea con aprobación rápida.', 'https://prestala.mx', 0, 0, 0, false),
-- 4. INFONAVIT (免费榜 rank 163)
('INFONAVIT', 'infonavit', 'government', 'Instituto del Fondo Nacional de la Vivienda para los Trabajadores. Ofrece créditos hipotecarios para trabajadores afiliados, consulta de saldo, pagos y trámites de vivienda.', 'https://www.infonavit.org.mx', 0, 0, 0, true),
-- 5. Novacard (免费榜 rank 165)
('Novacard', 'novacard', 'fintech', 'Tarjeta de crédito digital con aprobación rápida y sin anualidad. Ofrece línea de crédito para compras en línea y físicas con programa de recompensas.', 'https://www.novacard.mx', 0, 0, 0, false),
-- 6. Baubap (免费榜 rank 180)
('Baubap', 'baubap', 'sofom', 'Plataforma de préstamos personales en línea con aprobación en minutos. SOFOM ENR regulada por CONDUSEF. Proceso 100% digital sin garantía.', 'https://www.baubap.com', 0, 0, 0, false),
-- 7. Tala (免费榜 rank 183)
('Tala', 'tala', 'sofom', 'Plataforma de microcréditos y préstamos personales en línea con aprobación rápida basada en análisis alternativo de datos. Disponible en México, India, Kenia y Filipinas.', 'https://www.talamx.com', 0, 0, 0, false),
-- 8. Aplazo (免费榜 rank 206)
('Aplazo', 'aplazo', 'fintech', 'Plataforma de compras a plazos (BNPL) que permite comprar hoy y pagar en quincenas. Sin tarjeta de crédito, 100% digital. Disponible en miles de tiendas.', 'https://aplazo.mx', 0, 0, 0, false),
-- 9. HSBC México (免费榜 rank 242)
('HSBC México', 'hsbc-mexico', 'bank', 'Banco internacional con presencia en México. Ofrece tarjetas de crédito, préstamos personales, hipotecas, inversión y servicios empresariales con respaldo global.', 'https://www.hsbc.com.mx', 0, 0, 0, true),
-- 10. INVEX (免费榜)
('INVEX', 'invex', 'bank', 'Banco INVEX con tarjetas de crédito, inversión y servicios financieros. Especializado en clientes con perfil de inversión y productos a medida.', 'https://www.bancoinvex.com', 0, 0, 0, false),
-- 11. Impulso Cash (免费榜)
('Impulso Cash', 'impulso-cash', 'sofom', 'Plataforma de préstamos personales en efectivo con aprobación rápida. Sin garantía, sin aval. Proceso simple para obtener dinero urgente.', 'https://www.impulsocash.com', 0, 0, 0, false),
-- 12. iNu México (免费榜)
('iNu México', 'inu-mexico', 'sofom', 'Préstamos personales en línea sin revisar buró de crédito. SOFOM ENR con proceso 100% digital. Especializado en personas sin acceso a crédito tradicional.', 'https://www.inumexico.com', 0, 0, 0, false),
-- 13. Bradescard (免费榜)
('Bradescard', 'bradescard', 'fintech', 'Tarjeta de crédito Bradescard para compras en comercios afiliados. Ofrece meses sin intereses, promociones exclusivas y programa de recompensas.', 'https://www.bradescard.com.mx', 0, 0, 0, false),
-- 14. Somos Crédito (免费榜)
('Somos Crédito', 'somos-credito', 'sofom', 'Plataforma de préstamos personales en línea. SOFOM ENR enfocada en inclusión financiera con proceso rápido y transparente para sectores populares.', 'https://www.somoscredito.com', 0, 0, 0, false),
-- 15. Compartamos Banco (免费榜)
('Compartamos Banco', 'compartamos-banco', 'bank', 'Banco mexicano especializado en inclusión financiera. Ofrece créditos grupales e individuales, tarjetas de crédito, ahorro y seguros para sectores populares.', 'https://www.compartamos.com', 0, 0, 0, false),
-- 16. FONACOT (免费榜)
('FONACOT', 'fonacot', 'government', 'Instituto del Fondo Nacional para el Consumo de los Trabajadores. Ofrece créditos al consumo para trabajadores, consulta de crédito, pagos y trámites.', 'https://www.fonacot.gob.mx', 0, 0, 0, true),
-- 17. Zenfi (畅销榜)
('Zenfi', 'zenfi', 'fintech', 'Plataforma de bienestar financiero con préstamos personales y herramientas de educación financiera. Análisis de crédito basado en inteligencia artificial.', 'https://www.zenfi.com.mx', 0, 0, 0, false),
-- 18. Moneyman (App Store Mexico Finance)
('Moneyman', 'moneyman', 'sofom', 'Plataforma de préstamos personales en línea con aprobación rápida. SOFOM ENR regulada. Primer préstamo sin intereses para nuevos usuarios.', 'https://www.moneyman.com.mx', 0, 0, 0, false),
-- 19. Yotepresto (App Store Mexico Finance)
('Yotepresto', 'yotepresto', 'sofom', 'Plataforma de préstamos P2P (peer-to-peer) que conecta inversionistas con acreditados. Créditos personales con tasas competitivas basadas en perfil de riesgo.', 'https://www.yotepresto.com', 0, 0, 0, false),
-- 20. Hey Banco (App Store Mexico Finance)
('Hey Banco', 'hey-banco', 'bank', 'Banco 100% digital con tarjetas de crédito sin anualidad, préstamos personales, créditos de auto e hipotecarios. Respaldo de Banregio Grupo Financiero.', 'https://banco.hey.inc', 0, 0, 0, true)
ON CONFLICT (slug) DO NOTHING;
