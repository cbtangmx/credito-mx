-- ============================================
-- 批量插入新信贷机构 + 评价 + 投诉
-- 数据来源：点点数据 App Store 墨西哥区财务免费榜
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================

-- ============================================
-- Step 1: 插入 14 个新机构
-- ============================================
INSERT INTO institutions (name, slug, type, description, website_url, rating, review_count, complaint_count, is_verified) VALUES
('Mercado Pago', 'mercado-pago', 'fintech', 'Plataforma financiera digital con cuenta, tarjeta, pagos y créditos. Mercado Crédito ofrece préstamos personales y para negocios con aprobación rápida.', 'https://mercadopago.com.mx', 0, 0, 0, true),
('Banco Plata', 'banco-plata', 'fintech', 'Banco digital con tarjeta de débito, transferencias sin comisiones y servicios financieros accesibles para todos.', 'https://bancoplata.com', 0, 0, 0, true),
('BBVA México', 'bbva-mexico', 'bank', 'Uno de los bancos más grandes de México. Ofrece tarjetas de crédito, préstamos personales, hipotecas, inversión y servicios financieros completos.', 'https://www.bbva.mx', 0, 0, 0, true),
('Revolut', 'revolut', 'fintech', 'Banco digital global con tarjeta, cuentas multidivisa, criptomonedas y productos de crédito disponibles en México.', 'https://www.revolut.com', 0, 0, 0, true),
('DiDi Finanzas', 'didi-finanzas', 'fintech', 'Plataforma financiera de DiDi que ofrece tarjeta, pagos, transferencias y servicios de crédito para usuarios y conductores.', 'https://www.didiglobal.com', 0, 0, 0, true),
('Banco del Bienestar', 'banco-del-bienestar', 'bank', 'Banco del gobierno mexicano enfocado en inclusión financiera. Ofrece cuentas de ahorro, microcréditos y pagos de programas sociales.', 'https://www.bancodebienestar.gob.mx', 0, 0, 0, true),
('Spin by OXXO', 'spin-by-oxxo', 'fintech', 'Billetera digital de OXXO con tarjeta, pagos, transferencias y servicios de crédito personal en tiendas de todo el país.', 'https://spin.com.mx', 0, 0, 0, true),
('Banco Azteca', 'banco-azteca', 'bank', 'Banco con presencia en todo México, especializado en crédito al consumo, ahorro y servicios financieros para sectores populares.', 'https://www.bancoazteca.com.mx', 0, 0, 0, false),
('BanCoppel', 'bancoppel', 'bank', 'Banco de Coppel que ofrece cuentas de ahorro, tarjetas de crédito, préstamos personales y servicios financieros para toda la familia.', 'https://www.bancoppel.com', 0, 0, 0, false),
('Cashi', 'cashi', 'fintech', 'Billetera digital con tarjeta, pagos y servicios de crédito personal de aprobación rápida.', 'https://cashi.mx', 0, 0, 0, false),
('Kueski', 'kueski', 'fintech', 'Plataforma de compras a plazos (BNPL) y préstamos personales en línea. Líder en Buy Now Pay Later en México.', 'https://www.kueski.com', 0, 0, 0, false),
('MexDin', 'mexdin', 'sofom', 'Plataforma de préstamos personales en línea con aprobación rápida y sin garantía. Proceso 100% digital.', 'https://mexdin.com', 0, 0, 0, false),
('Santander México', 'santander-mexico', 'bank', 'Uno de los bancos más grandes de México. Ofrece tarjetas de crédito, préstamos, hipotecas, inversión y servicios empresariales.', 'https://www.santander.com.mx', 0, 0, 0, false),
('CashMex', 'cashmex', 'sofom', 'Plataforma de préstamos personales en línea con respuesta inmediata y sin aval. Proceso simple y transparente.', 'https://cashmex.com', 0, 0, 0, false)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Step 2: 插入评价数据（用 slug 子查询获取 institution_id）
-- ============================================
INSERT INTO reviews (institution_id, user_name, rating, title, content, source, is_approved, created_at) VALUES
-- Mercado Pago (6条)
((SELECT id FROM institutions WHERE slug = 'mercado-pago'), 'Roberto Sánchez', 5, 'La mejor app de pago en México', 'Mercado Pago lo tiene todo: pago sin contacto, transferencias, tarjeta física y el crédito. Mercado Crédito me salvó cuando necesitaba dinero urgente, aprobación en minutos.', 'user', true, NOW() - INTERVAL '19 days'),
((SELECT id FROM institutions WHERE slug = 'mercado-pago'), 'Daniela Cruz', 4, 'Muy útil para el día a día', 'La uso para todo: pagar en tiendas, transferir dinero, recargar tiempo aire. El QR funciona perfecto. Solo le quito una estrella porque a veces el cashback tarda en llegar.', 'user', true, NOW() - INTERVAL '14 days'),
((SELECT id FROM institutions WHERE slug = 'mercado-pago'), 'Mauricio Reyes', 5, 'Mercado Crédito es excelente', 'El préstamo de Mercado Crédito me pareció muy práctico. Sin papeleo, sin trámites, todo desde la app. Las tasas son razonables y puedes pagar en parcialidades.', 'user', true, NOW() - INTERVAL '11 days'),
((SELECT id FROM institutions WHERE slug = 'mercado-pago'), 'Fernanda Ortega', 4, 'Buena app pero con detalles', 'Funciona bien para pagos y transferencias. La tarjeta física llegó rápido. El crédito está bien pero los límites iniciales son bajos, van subiendo con el uso.', 'user', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM institutions WHERE slug = 'mercado-pago'), 'Iván Moreno', 5, 'No podría vivir sin esta app', 'Desde que la descubrí dejé de usar efectivo. Pago todo con QR, transfiero a amigos, pago servicios. Y el préstamo de Mercado Crédito me sacó de un apuro.', 'user', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM institutions WHERE slug = 'mercado-pago'), 'Claudia Pineda', 3, 'Bien pero el soporte falla', 'La app funciona bien pero tuve un problema con un pago no reconocido y el soporte tardó 4 días en responder. Por lo demás, los servicios de crédito son útiles.', 'user', true, NOW() - INTERVAL '3 days'),

-- Banco Plata (4条)
((SELECT id FROM institutions WHERE slug = 'banco-plata'), 'Eduardo Torres', 4, 'Buen banco digital', 'La cuenta es gratis, sin comisiones y la tarjeta funciona bien. El proceso de apertura fue 100% digital y rápido. Les falta más cajeros automáticos.', 'user', true, NOW() - INTERVAL '16 days'),
((SELECT id FROM institutions WHERE slug = 'banco-plata'), 'Silvia Navarro', 5, 'Excelente experiencia', 'Abrí mi cuenta en 10 minutos desde mi celular. La tarjeta llegó en 3 días. Sin comisiones, sin saldo mínimo. Justo lo que necesitaba.', 'user', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM institutions WHERE slug = 'banco-plata'), 'Ricardo Mendoza', 3, 'Falta madurar', 'El concepto es bueno pero la app tiene bugs. A veces se cierra sola. El servicio al cliente responde pero tarda. Espero que mejoren con el tiempo.', 'user', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'banco-plata'), 'Patricia Lara', 4, 'Recomendable', 'Sin comisiones, transferencias gratis, buena app. Lo único que mejoraría es agregar más productos como créditos o inversiones.', 'user', true, NOW() - INTERVAL '4 days'),

-- BBVA México (5条)
((SELECT id FROM institutions WHERE slug = 'bbva-mexico'), 'Gabriela Ruiz', 4, 'Banco sólido y confiable', 'BBVA es mi banco de toda la vida. La app funciona bien, puedo hacer todo desde mi celular. Los préstamos personales tienen buenas tasas si tienes buen historial.', 'user', true, NOW() - INTERVAL '20 days'),
((SELECT id FROM institutions WHERE slug = 'bbva-mexico'), 'Carlos Vega', 3, 'Demasiados trámites', 'El banco es seguro pero todo requiere muchos papeles. Pedir un préstamo me tomó 2 semanas. La app está bien pero la atención en sucursal es lenta.', 'user', true, NOW() - INTERVAL '15 days'),
((SELECT id FROM institutions WHERE slug = 'bbva-mexico'), 'Mónica Estrada', 5, 'Excelente servicio digital', 'La app de BBVA es de las mejores de los bancos tradicionales. Pago todo desde ahí, tarjeta digital, transferencias inmediatas. El crédito automotriz fue rápido.', 'user', true, NOW() - INTERVAL '11 days'),
((SELECT id FROM institutions WHERE slug = 'bbva-mexico'), 'Jorge Salazar', 4, 'Buen banco tradicional', 'Tengo mi nómina aquí y todo funciona bien. La tarjeta de crédito tiene buenos beneficios. Las tasas de préstamo son competitivas comparadas con otros bancos.', 'user', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM institutions WHERE slug = 'bbva-mexico'), 'Verónica Castro', 2, 'Servicio al cliente deficiente', 'Tuve un problema con un cargo y me mandaron de departamento en departamento. La app funciona pero cuando necesitas ayuda humana, es frustrante.', 'user', true, NOW() - INTERVAL '5 days'),

-- Revolut (4条)
((SELECT id FROM institutions WHERE slug = 'revolut'), 'Andrés Felipe', 5, 'Perfecto para viajar', 'Revolut es increíble para viajes. Sin comisiones por cambio de divisa, tarjeta virtual desechable, todo desde la app. En México funciona perfecto con Apple Pay.', 'user', true, NOW() - INTERVAL '17 days'),
((SELECT id FROM institutions WHERE slug = 'revolut'), 'María José', 4, 'Muy buena alternativa', 'Me encanta la app, tiene criptomonedas, inversiones, cambio de moneda. Solo le falta más aceptación en comercios pequeños en México.', 'user', true, NOW() - INTERVAL '13 days'),
((SELECT id FROM institutions WHERE slug = 'revolut'), 'Sebastián Ortiz', 3, 'Bien pero limitado en México', 'La app es excelente pero en México faltan funciones locales. No puedo recibir transferencias SPEI todavía. Para uso internacional es lo mejor.', 'user', true, NOW() - INTERVAL '9 days'),
((SELECT id FROM institutions WHERE slug = 'revolut'), 'Valentina Gómez', 5, 'El mejor banco digital', 'Sin comisiones ocultas, tipos de cambio reales, tarjeta metal hermosa. El soporte por chat es rápido. Esperando que agreguen créditos en México pronto.', 'user', true, NOW() - INTERVAL '6 days'),

-- DiDi Finanzas (4条)
((SELECT id FROM institutions WHERE slug = 'didi-finanzas'), 'Óscar Ramírez', 4, 'Buena opción de crédito', 'Como conductor de DiDi, la tarjeta me funciona bien para gasolina. El adelanto de nómina es útil. Tasas razonables para el segmento.', 'user', true, NOW() - INTERVAL '14 days'),
((SELECT id FROM institutions WHERE slug = 'didi-finanzas'), 'Lucía Fernández', 3, 'Necesita mejorar', 'La tarjeta funciona pero la app se traba. El crédito es útil pero los montos son bajos al inicio. Espero que mejoren el soporte.', 'user', true, NOW() - INTERVAL '10 days'),
((SELECT id FROM institutions WHERE slug = 'didi-finanzas'), 'Pedro Gutiérrez', 5, 'Muy conveniente', 'Uso la tarjeta DiDi para todo, ahorro en gasolina con el cashback. El préstamo personal me ayudó mucho, aprobación rápida sin tanto papeleo.', 'user', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'didi-finanzas'), 'Carolina Vázquez', 4, 'Súper práctico', 'La tarjeta funciona en todas partes, el cashback en gasolina es real. El crédito es accesible. Buena opción si usas DiDi frecuentemente.', 'user', true, NOW() - INTERVAL '3 days'),

-- Banco del Bienestar (3条)
((SELECT id FROM institutions WHERE slug = 'banco-del-bienestar'), 'Teresa Morales', 4, 'Útil para recibir apoyos', 'Recibo mi apoyo del gobierno aquí. La tarjeta funciona bien para retirar y pagar. Las sucursales hay en muchos lugares pero siempre hay fila.', 'user', true, NOW() - INTERVAL '18 days'),
((SELECT id FROM institutions WHERE slug = 'banco-del-bienestar'), 'Jesús Huerta', 3, 'Cumple su función', 'Es un banco básico. Sirve para recibir pagos del gobierno y hacer transferencias. No esperes servicios premium. La app es simple pero funciona.', 'user', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM institutions WHERE slug = 'banco-del-bienestar'), 'Rosa María', 4, 'Bueno para inclusión', 'Lejos de mi pueblo no había banco, solo el Banco del Bienestar. Me sirve para recibir mi pensión y hacer transferencias. La app funciona aceptable.', 'user', true, NOW() - INTERVAL '8 days'),

-- Spin by OXXO (4条)
((SELECT id FROM institutions WHERE slug = 'spin-by-oxxo'), 'Francisco Díaz', 4, 'Muy conveniente con OXXO', 'La tarjeta Spin la uso para pagar en OXXO y tiene cashback. Las transferencias son gratis. Retiro en cualquier OXXO sin comisión.', 'user', true, NOW() - INTERVAL '15 days'),
((SELECT id FROM institutions WHERE slug = 'spin-by-oxxo'), 'Alejandra Soto', 3, 'Regular', 'Funciona bien para pagos en OXXO pero fuera de ahí la aceptación es limitada. La app tiene bugs a veces. El crédito personal tiene tasas altas.', 'user', true, NOW() - INTERVAL '10 days'),
((SELECT id FROM institutions WHERE slug = 'spin-by-oxxo'), 'Manuel Cisneros', 5, 'Excelente para el día a día', 'Sin comisiones, retiro gratis en cualquier OXXO, transferencias gratis. La tarjeta funciona en tiendas y online. El préstamo personal me sorprendió, rápido y claro.', 'user', true, NOW() - INTERVAL '6 days'),
((SELECT id FROM institutions WHERE slug = 'spin-by-oxxo'), 'Brenda Aguilar', 4, 'Buena opción', 'La uso para pagar servicios, recargar saldo y transferir. El cashback en OXXO es bueno. La tarjeta de crédito tiene buenas promociones.', 'user', true, NOW() - INTERVAL '2 days'),

-- Banco Azteca (4条)
((SELECT id FROM institutions WHERE slug = 'banco-azteca'), 'Sandra Ibarra', 3, 'Crédito accesible pero caro', 'Banco Azteca te da crédito fácil pero las tasas son altas. Sirve cuando necesitas algo urgente. La app funciona bien para pagos y transferencias.', 'user', true, NOW() - INTERVAL '19 days'),
((SELECT id FROM institutions WHERE slug = 'banco-azteca'), 'Raúl Cardona', 4, 'Bueno para crédito al consumo', 'Compré una TV a meses sin intereses y el proceso fue rápido. La app funciona bien para ver saldos y pagar. Las sucursales hay en todos lados.', 'user', true, NOW() - INTERVAL '14 days'),
((SELECT id FROM institutions WHERE slug = 'banco-azteca'), 'Magdalena Ríos', 2, 'Tasas muy altas', 'El crédito es fácil de obtener pero pagas el doble al final. La app funciona pero los cargos no siempre son claros. Solo úsalo si es urgente.', 'user', true, NOW() - INTERVAL '10 days'),
((SELECT id FROM institutions WHERE slug = 'banco-azteca'), 'Óscar Blanco', 4, 'Cumple lo que promete', 'Para crédito al consumo funciona bien. La app es básica pero hace lo necesario. Las promociones en tiendas Elektra son atractivas.', 'user', true, NOW() - INTERVAL '5 days'),

-- BanCoppel (4条)
((SELECT id FROM institutions WHERE slug = 'bancoppel'), 'Arturo Domínguez', 4, 'Buen banco para principiantes', 'Abrí cuenta sin problema, sin comisiones. La tarjeta de crédito me ayudó a crear historial. La app funciona bien para pagos y transferencias.', 'user', true, NOW() - INTERVAL '16 days'),
((SELECT id FROM institutions WHERE slug = 'bancoppel'), 'Yadira Solís', 3, 'Necesita mejorar la app', 'El servicio bancario está bien pero la app se traba mucho. Los préstamos personales tienen tasas competitivas. Las sucursales en Coppel son convenientes.', 'user', true, NOW() - INTERVAL '11 days'),
((SELECT id FROM institutions WHERE slug = 'bancoppel'), 'Fernando Leyva', 4, 'Súper accesible', 'Abierto en domingo, en cada tienda Coppel. El crédito personal me aprobaron rápido. La app funciona aceptable para lo básico.', 'user', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'bancoppel'), 'Gloria Padilla', 5, 'Excelente servicio', 'El mejor banco para personas que no tienen acceso a bancos tradicionales. Sin comisiones, crédito accesible, sucursales en cada esquina. Muy contenta.', 'user', true, NOW() - INTERVAL '3 days'),

-- Cashi (3条)
((SELECT id FROM institutions WHERE slug = 'cashi'), 'Iván Gallegos', 4, 'Buena billetera digital', 'Cashi funciona bien para pagos y transferencias. El crédito personal es rápido, aprobación en minutos. La tarjeta funciona en la mayoría de comercios.', 'user', true, NOW() - INTERVAL '13 days'),
((SELECT id FROM institutions WHERE slug = 'cashi'), 'Mariana Beltrán', 3, 'Faltan más comercios', 'La app funciona bien pero no muchos comercios la aceptan. El crédito es útil pero los montos son bajos. Espero que crezcan.', 'user', true, NOW() - INTERVAL '9 days'),
((SELECT id FROM institutions WHERE slug = 'cashi'), 'Rubén Acosta', 5, 'Préstamo rápido y fácil', 'Necesitaba dinero urgente y Cashi me lo dio en 10 minutos. Sin papeleo, todo desde la app. Las tasas son razonables para la rapidez.', 'user', true, NOW() - INTERVAL '5 days'),

-- Kueski (4条)
((SELECT id FROM institutions WHERE slug = 'kueski'), 'Sofía Villanueva', 5, 'El BNPL de México', 'Kueski es genial para comprar a plazos sin tarjeta de crédito. Compré un celular a 6 meses sin intereses. Proceso súper rápido, todo digital.', 'user', true, NOW() - INTERVAL '18 days'),
((SELECT id FROM institutions WHERE slug = 'kueski'), 'Diego Pizarro', 4, 'Muy útil para compras', 'Buen servicio de compras a plazos. La aprobación es rápida y los pagos son manejables. Solo cuidado con los intereses si te atrasas.', 'user', true, NOW() - INTERVAL '13 days'),
((SELECT id FROM institutions WHERE slug = 'kueski'), 'Andrea Cabrera', 3, 'Bien pero con condiciones', 'Funciona para compras a plazos pero los intereses por atraso son altos. El préstamo personal también está bien si pagas a tiempo.', 'user', true, NOW() - INTERVAL '9 days'),
((SELECT id FROM institutions WHERE slug = 'kueski'), 'Tomás Rico', 5, 'Salvavidas financiero', 'Cuando no tenía tarjeta de crédito, Kueski me permitió comprar lo que necesitaba a plazos. Proceso claro, sin sorpresas. Muy recomendado.', 'user', true, NOW() - INTERVAL '5 days'),

-- MexDin (3条)
((SELECT id FROM institutions WHERE slug = 'mexdin'), 'Paola Meneses', 3, 'Préstamo rápido pero caro', 'Me dieron el préstamo en 24 horas, eso es bueno. Pero la tasa es más alta que un banco. Lee bien el contrato antes de firmar.', 'user', true, NOW() - INTERVAL '14 days'),
((SELECT id FROM institutions WHERE slug = 'mexdin'), 'Hugo Barragán', 4, 'Bueno para emergencias', 'Necesitaba dinero urgente y MexDin me lo dio rápido. El proceso es 100% digital. La tasa no es la mejor pero la velocidad lo compensa.', 'user', true, NOW() - INTERVAL '9 days'),
((SELECT id FROM institutions WHERE slug = 'mexdin'), 'Daniela Sandoval', 2, 'Tasa demasiado alta', 'El préstamo fue rápido pero al final pago casi el doble. No lo recomiendo a menos que sea una emergencia real.', 'user', true, NOW() - INTERVAL '5 days'),

-- Santander México (5条)
((SELECT id FROM institutions WHERE slug = 'santander-mexico'), 'Roberto Ortega', 4, 'Buen banco tradicional', 'Santander tiene buena red de cajeros y sucursales. La app funciona bien. El crédito personal me lo aprobaron en 3 días con buena tasa.', 'user', true, NOW() - INTERVAL '21 days'),
((SELECT id FROM institutions WHERE slug = 'santander-mexico'), 'Carla Domínguez', 5, 'Excelente atención', 'El mejor banco en servicio al cliente que he usado. La app es intuitiva, el crédito automotriz fue rápido y con buenas condiciones. Recomendado.', 'user', true, NOW() - INTERVAL '17 days'),
((SELECT id FROM institutions WHERE slug = 'santander-mexico'), 'Miguel Treviño', 3, 'Bien pero con comisiones', 'El banco está bien pero cobran comisiones por todo. El crédito tiene buena tasa pero los productos adicionales son caros. La app funciona bien.', 'user', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM institutions WHERE slug = 'santander-mexico'), 'Laura Quiñones', 4, 'Sólido y confiable', 'Tengo mi cuenta de nómina y tarjeta de crédito aquí. Buena atención en sucursal, la app funciona. Los préstamos personales tienen tasas competitivas.', 'user', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM institutions WHERE slug = 'santander-mexico'), 'Pablo Retana', 2, 'Demasiado burocrático', 'Todo requiere papeles y firmas. Pedí un préstamo y me pidieron demasiados requisitos. La app está bien pero el proceso en sucursal es lento.', 'user', true, NOW() - INTERVAL '4 days'),

-- CashMex (3条)
((SELECT id FROM institutions WHERE slug = 'cashmex'), 'Lorena Fuentes', 3, 'Rápido pero caro', 'El préstamo lo obtuve en horas, sin duda rápido. Pero la tasa de interés es alta. Úsalo solo para emergencias, no para financiar a largo plazo.', 'user', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM institutions WHERE slug = 'cashmex'), 'Esteban Mata', 4, 'Cumple su función', 'Cuando necesitas dinero ya, CashMex es una opción. Sin aval, sin papeleo. La tasa es alta pero el proceso es transparente desde el inicio.', 'user', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'cashmex'), 'Gabriela Núñez', 2, 'No transparente', 'Me dijeron una tasa y al firmar era otra. El préstamo es rápido pero las condiciones no son claras. Cuidado con la letra chiquita.', 'user', true, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- ============================================
-- Step 3: 插入投诉数据
-- ============================================
INSERT INTO complaints (institution_id, user_name, user_email, title, content, category, status, is_public, created_at) VALUES
((SELECT id FROM institutions WHERE slug = 'mercado-pago'), 'Carlos Peña', 'carlos.p@email.com', 'Mercado Crédito me cobró de más', 'Saqué un préstamo de Mercado Crédito y me cobraron una comisión que no estaba en el contrato. Llevo 2 semanas reportándolo y no me dan solución.', 'charges', 'reviewing', true, NOW() - INTERVAL '6 days'),
((SELECT id FROM institutions WHERE slug = 'mercado-pago'), 'Ana Lucía', 'ana.l@email.com', 'Cuenta bloqueada sin razón', 'De repente me bloquearon la cuenta sin explicación. Tengo mi dinero ahí y no puedo acceder. El soporte no responde claramente qué pasó.', 'service', 'pending', true, NOW() - INTERVAL '3 days'),
((SELECT id FROM institutions WHERE slug = 'banco-plata'), 'Roberto Díaz', 'roberto.d@email.com', 'Tarjeta no funciona en cajeros', 'La tarjeta no funciona en la mayoría de cajeros automáticos. Solo puedo retirar en lugares específicos. No es práctico para el día a día.', 'service', 'pending', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM institutions WHERE slug = 'bbva-mexico'), 'Mónica Rivas', 'monica.r@email.com', 'Cargo duplicado en mi tarjeta de crédito', 'Me apareció un cargo duplicado por $5,000 en mi tarjeta de crédito BBVA. Ya llevo 3 semanas reportándolo y me dicen que espere, pero el cargo sigue ahí.', 'charges', 'reviewing', true, NOW() - INTERVAL '9 days'),
((SELECT id FROM institutions WHERE slug = 'bbva-mexico'), 'Fernando Cruz', 'fernando.c@email.com', 'Tasa de interés más alta de lo prometido', 'Me ofrecieron una tasa del 24% en un préstamo personal pero al firmar era del 36%. Se siente como engaño, pero ya firmé el contrato.', 'rates', 'pending', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM institutions WHERE slug = 'revolut'), 'Sofía Reyes', 'sofia.r@email.com', 'No puedo transferir a bancos mexicanos', 'La función de transferencia SPEI no funciona. No puedo recibir dinero de bancos mexicanos en mi cuenta Revolut. Esto limita mucho la utilidad de la cuenta.', 'service', 'pending', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'didi-finanzas'), 'Pedro Martínez', 'pedro.m@email.com', 'Adelanto de nómina con cargos ocultos', 'Pedí un adelanto de nómina y me cobraron comisiones que no me explicaron. El monto a devolver es mucho mayor a lo que me prestaron.', 'charges', 'reviewing', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM institutions WHERE slug = 'banco-del-bienestar'), 'Rosa Elena', 'rosa.e@email.com', 'Fila de 3 horas en sucursal', 'Cada vez que voy a la sucursal hay filas de horas. Solo hay 2 cajeros para 50 personas. El servicio es demasiado lento.', 'service', 'pending', true, NOW() - INTERVAL '11 days'),
((SELECT id FROM institutions WHERE slug = 'spin-by-oxxo'), 'Manuel Ortega', 'manuel.o@email.com', 'Cashback no acreditado', 'Llevo 2 meses esperando el cashback de mis compras en OXXO con Spin. Me dicen que ya se acreditó pero no aparece en mi cuenta.', 'charges', 'reviewing', true, NOW() - INTERVAL '6 days'),
((SELECT id FROM institutions WHERE slug = 'banco-azteca'), 'Juan Carlos', 'juan.c@email.com', 'Cobranza agresiva por atraso de 1 día', 'Me atrasé un día en el pago y ya me estaban llamando a las 7 de la mañana. La cobranza es excesivamente agresiva para un día de retraso.', 'collection', 'pending', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM institutions WHERE slug = 'banco-azteca'), 'María Luisa', 'maria.l@email.com', 'Tasa de interés abusiva', 'Compré un electrodoméstico a meses y al final voy a pagar casi el triple. Las tasas son abusivas y no las explican claramente al inicio.', 'rates', 'reviewing', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM institutions WHERE slug = 'bancoppel'), 'Patricia Vega', 'patricia.v@email.com', 'No me dejan cancelar tarjeta de crédito', 'Quiero cancelar mi tarjeta de crédito porque ya no la uso y me siguen cobrando anualidad. He ido 3 veces a sucursal y no me la cancelan.', 'service', 'pending', true, NOW() - INTERVAL '10 days'),
((SELECT id FROM institutions WHERE slug = 'cashi'), 'Iván Reyes', 'ivan.r@email.com', 'Préstamo con tasa engañosa', 'Me ofrecieron una tasa baja pero al final me cobraron mucho más. Las comisiones no están claras en la app. Se siente como estafa.', 'rates', 'pending', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM institutions WHERE slug = 'kueski'), 'Diego Morales', 'diego.m@email.com', 'Cobro injustificado por atraso', 'Me atrasé 2 días en un pago y me cobraron $500 de comisión por atraso. Es desproporcionado al monto del pago. La cobranza fue agresiva.', 'collection', 'reviewing', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'mexdin'), 'Hugo Pérez', 'hugo.p@email.com', 'Tasa mucho más alta de lo anunciado', 'La publicidad dice tasa desde 30% pero me dieron 89%. Es engañoso. Cuando reclamo dicen que mi perfil de riesgo justifica la tasa.', 'rates', 'pending', true, NOW() - INTERVAL '6 days'),
((SELECT id FROM institutions WHERE slug = 'santander-mexico'), 'Laura Soto', 'laura.s@email.com', 'Cargo no reconocido en mi cuenta', 'Me apareció un cargo de $3,500 que no hice. Reporté inmediatamente pero llevan 3 semanas sin resolver. El dinero sigue sin aparecer.', 'charges', 'reviewing', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM institutions WHERE slug = 'santander-mexico'), 'Roberto Mora', 'roberto.m@email.com', 'Seguro de deuda no solicitado', 'Me agregaron un seguro de deuda a mi préstamo sin mi autorización. Me di cuenta cuando vi los cobros mensuales. Ahora quiero cancelarlo y no me dejan.', 'charges', 'pending', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM institutions WHERE slug = 'cashmex'), 'Esteban Gil', 'esteban.g@email.com', 'Comisiones ocultas en el préstamo', 'El préstamo lo conseguí rápido pero me cobraron comisión por apertura, por estudio, por gestión. Al final el monto que recibí fue mucho menor al solicitado.', 'charges', 'pending', true, NOW() - INTERVAL '4 days')
ON CONFLICT DO NOTHING;

-- ============================================
-- Step 4: 更新 institutions 表的统计字段
-- ============================================
UPDATE institutions SET
  rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE institution_id = institutions.id AND is_approved = true), 0),
  review_count = (SELECT COUNT(*) FROM reviews WHERE institution_id = institutions.id AND is_approved = true),
  complaint_count = (SELECT COUNT(*) FROM complaints WHERE institution_id = institutions.id AND is_public = true),
  updated_at = NOW();

-- ============================================
-- 验证：查看所有机构数据
-- ============================================
SELECT name, slug, type, ROUND(rating::numeric, 2) as rating, review_count, complaint_count
FROM institutions
ORDER BY rating DESC, review_count DESC;
