-- ============================================
-- 评价和投诉数据（用 slug 子查询动态获取 institution_id）
-- 适用于 institutions 表已有数据的情况
-- 在 Supabase SQL Editor 中直接执行
-- ============================================

-- 清空旧数据（避免重复）
DELETE FROM reviews;
DELETE FROM complaints;

-- ============================================
-- 插入评价数据（42条）
-- 用子查询 (SELECT id FROM institutions WHERE slug = 'xxx') 动态获取 ID
-- ============================================
INSERT INTO reviews (institution_id, user_name, rating, title, content, source, is_approved, created_at) VALUES
-- Stori (8条评价)
((SELECT id FROM institutions WHERE slug = 'stori'), 'María González', 5, 'Excelente servicio y app muy intuitiva', 'Llevo 6 meses usando Stori y la experiencia ha sido muy buena. La aplicación es muy fácil de usar, el proceso de solicitud fue rápido y recibí respuesta en menos de 24 horas. Recomiendo ampliamente para quienes buscan su primera tarjeta de crédito.', 'user', true, NOW() - INTERVAL '15 days'),
((SELECT id FROM institutions WHERE slug = 'stori'), 'Carlos Ramírez', 4, 'Buena tarjeta con beneficios', 'La tarjeta tiene buenos beneficios y el programa de cashback es atractivo. La única pega es que el límite de crédito inicial podría ser más alto, pero va aumentando con el uso responsable.', 'user', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM institutions WHERE slug = 'stori'), 'Ana López', 3, 'Servicio aceptable pero mejorable', 'El servicio es decente pero la atención al cliente puede mejorar. Tuve un problema con un cargo duplicado y tardaron 5 días en resolverlo. Por lo demás, la app funciona bien.', 'user', true, NOW() - INTERVAL '10 days'),
((SELECT id FROM institutions WHERE slug = 'stori'), 'Roberto Méndez', 4, 'Buena opción para empezar', 'Como alguien que apenas está construyendo historial crediticio, Stori me dio la oportunidad. El proceso fue claro y sin sorpresas. La tasa de interés es razonable comparada con otras opciones.', 'user', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM institutions WHERE slug = 'stori'), 'Patricia Silva', 5, 'Me encanta la experiencia', 'Sin lugar a dudas la mejor fintech que he usado. La app es rápida, el servicio al cliente responde rápido y nunca he tenido problemas con cargos no reconocidos. Muy recomendada.', 'user', true, NOW() - INTERVAL '6 days'),
((SELECT id FROM institutions WHERE slug = 'stori'), 'Luis Hernández', 4, 'Cumple lo que promete', 'Es una buena tarjeta de crédito para principiantes. El CAT es claro desde el inicio, sin sorpresas. Lo único que mejoraría es el proceso de aumento de límite.', 'user', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM institutions WHERE slug = 'stori'), 'Sofía Torres', 3, 'Regular, esperaba más', 'La tarjeta está bien pero esperaba más beneficios del programa de recompensas. El cashback es menor al que ofrecen otras fintechs similares. La app funciona bien sin problemas.', 'user', true, NOW() - INTERVAL '3 days'),
((SELECT id FROM institutions WHERE slug = 'stori'), 'Diego Morales', 5, 'Increíble experiencia digital', 'Todo el proceso es 100% digital, desde la solicitud hasta la entrega. La tarjeta llegó a mi casa en 3 días hábiles. Muy satisfecho con el servicio.', 'user', true, NOW() - INTERVAL '1 day'),

-- Klar (6条评价)
((SELECT id FROM institutions WHERE slug = 'klar'), 'Fernando Ruiz', 4, 'Buena cuenta digital sin comisiones', 'Llevo un año con Klar y no he pagado comisiones. La cuenta de ahorro da buenos rendimientos. Lo único que mejoraría es la velocidad de las transferencias SPEI.', 'user', true, NOW() - INTERVAL '14 days'),
((SELECT id FROM institutions WHERE slug = 'klar'), 'Gabriela Castro', 3, 'Aceptable pero con detalles', 'Funciona bien para el día a día, pero tuve un problema con el proceso de KYC que tardó más de lo esperado. Una vez verificado, todo fluye bien.', 'user', true, NOW() - INTERVAL '11 days'),
((SELECT id FROM institutions WHERE slug = 'klar'), 'Miguel Ángel Vega', 4, 'Buen servicio general', 'Me gusta que no cobra comisiones y los rendimientos son competitivos. La app es intuitiva. Recomendado para quien busca salir de los bancos tradicionales.', 'user', true, NOW() - INTERVAL '9 days'),
((SELECT id FROM institutions WHERE slug = 'klar'), 'Lucía Romero', 5, 'Excelente alternativa bancaria', 'Desde que uso Klar he ahorrado mucho en comisiones. La tarjeta funciona perfecta y el soporte responde rápido. Muy feliz con el cambio.', 'user', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'klar'), 'Andrés Salazar', 3, 'Bien pero no excelente', 'Cumple su función principal. La tasa de rendimiento es decente pero podría ser mejor. El servicio al cliente responde en tiempos aceptables.', 'user', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM institutions WHERE slug = 'klar'), 'Verónica Aguilar', 4, 'Buena experiencia', 'Llevo 8 meses usando Klar como cuenta principal. Todo funciona bien, los rendimientos son buenos y nunca he tenido problemas con la seguridad.', 'user', true, NOW() - INTERVAL '2 days'),

-- Nu Bank (10条评价)
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Juan Pablo Reyes', 5, 'El mejor banco digital de México', 'Nu es simplemente el mejor. Sin comisiones, app hermosa, soporte humano y rápido. Llevo 2 años y nunca he tenido un solo problema. La tarjeta de crédito sin anualidad es un golazo.', 'user', true, NOW() - INTERVAL '20 days'),
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Mariana Cortés', 5, 'Increíble servicio al cliente', 'Tuve un problema con una transacción y el soporte de Nu lo resolvió en 10 minutos por chat. Esto es servicio de verdad. La cuenta es perfecta para el día a día.', 'user', true, NOW() - INTERVAL '17 days'),
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Ricardo Navarro', 5, 'Cambió mi forma de manejar dinero', 'Nu me hizo darme cuenta de lo mucho que pagaba en comisiones en mi banco anterior. La app es súper intuitiva y el diseño es hermoso.', 'user', true, NOW() - INTERVAL '15 days'),
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Daniela Ortiz', 4, 'Muy buen banco digital', 'Nu es una excelente opción. Lo único es que a veces las transferencias internacionales tardan un poco, pero todo lo demás es perfecto.', 'user', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Esteban Domínguez', 5, 'Lo recomiendo 100%', 'Después de investigar mucho, me decidí por Nu y fue la mejor decisión. Sin comisiones ocultas, rendimientos diarios y atención al cliente espectacular.', 'user', true, NOW() - INTERVAL '10 days'),
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Adriana Vargas', 5, 'Perfecto en todos los sentidos', 'Llevo 18 meses con Nu y no puedo estar más satisfecha. La tarjeta funciona perfecta, los rendimientos son buenos y nunca he tenido problemas.', 'user', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Pablo Mendoza', 4, 'Excelente alternativa', 'Nu cumple lo que promete. Sin anualidad, sin comisiones, buena app. Lo único que echo de menos son sucursales físicas para casos especiales.', 'user', true, NOW() - INTERVAL '6 days'),
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Carla Espinoza', 5, 'Mi banco favorito', 'He probado varios bancos digitales y Nu es por mucho el mejor. La atención al cliente es increíble, te atienden personas reales y resuelven todo rápido.', 'user', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Héctor Fuentes', 5, 'Simplemente perfecto', 'Nu ha simplificado mi vida financiera. Todo desde la app, sin filas, sin comisiones absurdas. El diseño de la tarjeta es hermoso también.', 'user', true, NOW() - INTERVAL '2 days'),
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Isabel Cabrera', 4, 'Muy buena experiencia', 'Nu es una gran opción para el día a día. Solo le falta agregar más funcionalidades de inversión, pero en lo básico es excelente.', 'user', true, NOW() - INTERVAL '1 day'),

-- Crediclub (5条评价)
((SELECT id FROM institutions WHERE slug = 'crediclub'), 'Mauricio Peña', 3, 'Funciona pero caro', 'El préstamo lo obtuve rápido, eso es bueno. Pero la tasa de interés es más alta de lo que esperaba. Cumple si tienes urgencia pero compara opciones.', 'user', true, NOW() - INTERVAL '13 days'),
((SELECT id FROM institutions WHERE slug = 'crediclub'), 'Yolanda Treviño', 4, 'Rápido y sin tanto papeleo', 'Necesitaba dinero urgente y Crediclub me lo dio en 24 horas. El proceso es 100% en línea. La tasa no es la mejor pero la velocidad lo compensa.', 'user', true, NOW() - INTERVAL '10 days'),
((SELECT id FROM institutions WHERE slug = 'crediclub'), 'Sergio Bernal', 2, 'Decepcionante', 'Las promesas de tasa inicial eran buenas pero al final me ofrecieron una mucho más alta. El servicio al cliente tarda en responder cuando hay problemas.', 'user', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM institutions WHERE slug = 'crediclub'), 'Lorena Gallegos', 3, 'Aceptable', 'Funciona para emergencias. No es la opción más barata pero sí de las más rápidas. El proceso de pago es claro y puedes hacer todo en línea.', 'user', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM institutions WHERE slug = 'crediclub'), 'Rodrigo Pacheco', 4, 'Buena opción de emergencia', 'Cuando lo necesitas ya, Crediclub es una buena opción. El proceso es claro, sin engaños. Eso sí, lee bien la letra chiquita del contrato.', 'user', true, NOW() - INTERVAL '2 days'),

-- Minu (7条评价)
((SELECT id FROM institutions WHERE slug = 'minu'), 'Alejandro Ríos', 5, 'Perfecto para empleados', 'Como empleado con nómina, Minu me ofreció condiciones inmejorables. El descuento directo es muy conveniente y la tasa es muy buena comparada con otros préstamos.', 'user', true, NOW() - INTERVAL '16 days'),
((SELECT id FROM institutions WHERE slug = 'minu'), 'Cristina Mendoza', 4, 'Buena experiencia', 'Minu me ayudó cuando más lo necesitaba. El proceso fue rápido y el descuento por nómina hace que no tengas que preocuparte por los pagos.', 'user', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM institutions WHERE slug = 'minu'), 'Víctor Hugo Soto', 5, 'Excelente servicio', 'Llevo un año con Minu y ha sido perfecto. El descuento automático significa que nunca me atraso. La tasa es de las mejores del mercado.', 'user', true, NOW() - INTERVAL '9 days'),
((SELECT id FROM institutions WHERE slug = 'minu'), 'Mónica Lara', 4, 'Muy recomendable para asalariados', 'Si tienes un empleo formal, Minu es una de las mejores opciones. La tasa es competitiva y el proceso es 100% digital.', 'user', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'minu'), 'Gerardo Quintero', 3, 'Bien pero con condiciones', 'Funciona bien si tienes nómina fija. El proceso es rápido pero necesitas buen historial crediticio para que te aprueben. La tasa es competitiva.', 'user', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM institutions WHERE slug = 'minu'), 'Paola Estrada', 5, 'La mejor opción para mi', 'Después de comparar muchas opciones, Minu me ofreció la mejor combinación de tasa y plazo. El servicio es excelente y el proceso súper rápido.', 'user', true, NOW() - INTERVAL '3 days'),
((SELECT id FROM institutions WHERE slug = 'minu'), 'Alberto Nava', 4, 'Satisfecho con el servicio', 'Buen servicio, buena tasa. Lo único que mejoraría es la comunicación cuando hay cambios en las condiciones, pero en general muy satisfecho.', 'user', true, NOW() - INTERVAL '1 day'),

-- Konfio (6条评价)
((SELECT id FROM institutions WHERE slug = 'konfio'), 'Eduardo Villalobos', 5, 'Ideal para PyMEs', 'Como dueño de una pequeña empresa, Konfio me dio el capital que necesitaba en 48 horas. El proceso es 100% digital y las tasas son justas para el segmento.', 'user', true, NOW() - INTERVAL '18 days'),
((SELECT id FROM institutions WHERE slug = 'konfio'), 'Silvia Carrasco', 4, 'Muy buen servicio empresarial', 'Konfio ha sido clave para el crecimiento de mi negocio. El proceso es ágil y los requisitos no son tan complicados como en los bancos tradicionales.', 'user', true, NOW() - INTERVAL '14 days'),
((SELECT id FROM institutions WHERE slug = 'konfio'), 'Rodrigo Cárdenas', 4, 'Buen producto para emprendedores', 'Llevo 3 créditos con Konfio y todos han sido procesos rápidos. La plataforma es fácil de usar y el soporte responde bien a las dudas.', 'user', true, NOW() - INTERVAL '10 days'),
((SELECT id FROM institutions WHERE slug = 'konfio'), 'Marisol Guerrero', 5, 'Excelente alternativa bancaria', 'Konfio democratizó el acceso al crédito para empresas pequeñas. Sin las trabas de la banca tradicional. Muy recomendada para PyMEs.', 'user', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'konfio'), 'Jorge Luis Téllez', 3, 'Aceptable, depende del perfil', 'Konfio es bueno si tu empresa tiene cierta antigüedad y facturación. Las tasas no son las más bajas pero el proceso es mucho más rápido que un banco.', 'user', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM institutions WHERE slug = 'konfio'), 'Beatriz Solís', 5, 'Salva a las PyMEs', 'Konfio es la diferencia entre crecer o quedarte estancado para muchos pequeños negocios. El proceso es claro y los fondos llegan rápido.', 'user', true, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- ============================================
-- 插入投诉数据（13条）
-- ============================================
INSERT INTO complaints (institution_id, user_name, user_email, title, content, category, status, is_public, created_at) VALUES
-- Stori (3条)
((SELECT id FROM institutions WHERE slug = 'stori'), 'Roberto Martínez', 'roberto.m@email.com', 'Cargos no autorizados en mi tarjeta', 'Me aparecieron 3 cargos no reconocidos por un total de $2,500 pesos en menos de 24 horas. Ya reporté a Stori pero llevo una semana sin solución. Espero que me devuelvan el dinero pronto, no fue mi consumo.', 'charges', 'pending', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM institutions WHERE slug = 'stori'), 'Laura Pérez', 'laura.p@email.com', 'Problema con aumento de límite', 'Llevo 8 meses con Stori, siempre he pagado a tiempo y tengo un buen historial. Solicité un aumento de límite y me lo negaron sin explicación clara. El servicio al cliente no da respuestas concretas.', 'service', 'reviewing', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM institutions WHERE slug = 'stori'), 'Fernando Delgado', 'fernando.d@email.com', 'Cobranza agresiva después de 2 días', 'Tuve un cargo no reconocido y antes de que se resolviera el caso ya me estaban llamando insistentemente para cobrar. La cobranza es muy agresiva considerando que el cargo está en disputa.', 'collection', 'pending', true, NOW() - INTERVAL '3 days'),

-- Klar (2条)
((SELECT id FROM institutions WHERE slug = 'klar'), 'Ana Gabriela', 'ana.g@email.com', 'Cuenta bloqueada sin explicación', 'De la nada mi cuenta aparece como bloqueada y no puedo hacer nada. Llevo 3 días intentando resolver y nadie me da una respuesta clara de qué pasa o cuándo se va a resolver.', 'service', 'reviewing', true, NOW() - INTERVAL '6 days'),
((SELECT id FROM institutions WHERE slug = 'klar'), 'Luis Mario', 'luis.m@email.com', 'Rendimientos no reflejados', 'Me dijeron que mi dinero generaba rendimientos diarios pero al checar mi cuenta veo que no me han pagado nada en 2 meses. La respuesta del soporte es muy lenta.', 'rates', 'pending', true, NOW() - INTERVAL '10 days'),

-- Nu Bank (1条)
((SELECT id FROM institutions WHERE slug = 'nu-bank'), 'Mariana Espinoza', 'mariana.e@email.com', 'Problema con tarjeta de crédito Nu', 'Solicité mi tarjeta hace 2 meses y me dijeron que llegaría en 7 días. Ya van 60 días y no tengo tarjeta. El chat me dice cosas diferentes cada vez que pregunto.', 'service', 'resolved', true, NOW() - INTERVAL '15 days'),

-- Crediclub (4条)
((SELECT id FROM institutions WHERE slug = 'crediclub'), 'José Luis', 'jose.l@email.com', 'Tasa de interés más alta de lo prometido', 'Me ofrecieron una tasa del 35% CAT pero al firmar el contrato era del 78%. Se siente engañoso. Ya me quejé pero dicen que tengo que cumplir el contrato.', 'rates', 'reviewing', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM institutions WHERE slug = 'crediclub'), 'Gabriela Moreno', 'gabriela.m@email.com', 'Cobranza fuera de horario', 'Me llaman a las 9 de la noche para cobrar. Ya les dije que voy a pagar pero no dejan de llamar a todas horas. Es acoso.', 'collection', 'pending', true, NOW() - INTERVAL '2 days'),
((SELECT id FROM institutions WHERE slug = 'crediclub'), 'Ricardo Alonso', 'ricardo.a@email.com', 'Comisiones ocultas en el préstamo', 'Al final del préstamo pagué mucho más de lo que me habían dicho inicialmente. Las comisiones se van sumando y no las explican bien al principio.', 'charges', 'pending', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM institutions WHERE slug = 'crediclub'), 'Mónica Patricia', 'monica.p@email.com', 'No me dejaron refinanciar', 'Llevo al día con mis pagos y cuando quise refinanciar para bajar la tasa me dijeron que no calificaba. Se siente injusto siendo buen cliente.', 'rates', 'pending', true, NOW() - INTERVAL '1 day'),

-- Minu (2条)
((SELECT id FROM institutions WHERE slug = 'minu'), 'Daniela Sánchez', 'daniela.s@email.com', 'Problema con descuento de nómina', 'Mi empresa cambió de sistema de nómina y Minu no actualizó el descuento. Me cobraron doble un mes y tardaron en devolver el dinero.', 'service', 'resolved', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM institutions WHERE slug = 'minu'), 'Pablo Iván', 'pablo.i@email.com', 'Tasa más alta al refinanciar', 'Cuando quise refinanciar mi préstamo me ofrecieron una tasa peor que la original. No tiene sentido, debería ser al revés para clientes puntuales.', 'rates', 'pending', true, NOW() - INTERVAL '9 days'),

-- Konfio (1条)
((SELECT id FROM institutions WHERE slug = 'konfio'), 'Luis Roberto', 'luis.r@email.com', 'Proceso de KYC muy lento', 'Llevo 3 semanas intentando verificar mi empresa y subir todos los documentos. Cada vez me piden algo nuevo. El proceso es eterno.', 'service', 'reviewing', true, NOW() - INTERVAL '11 days')
ON CONFLICT DO NOTHING;

-- ============================================
-- 同步更新 institutions 表的统计字段
-- ============================================
UPDATE institutions SET
  rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE institution_id = institutions.id AND is_approved = true),
  review_count = (SELECT COUNT(*) FROM reviews WHERE institution_id = institutions.id AND is_approved = true),
  complaint_count = (SELECT COUNT(*) FROM complaints WHERE institution_id = institutions.id AND is_public = true),
  updated_at = NOW();
