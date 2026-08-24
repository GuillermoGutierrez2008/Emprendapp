-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-08-2026 a las 20:00:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `emprendapp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `costos_fijos`
--

CREATE TABLE `costos_fijos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `costos_fijos`
--

INSERT INTO `costos_fijos` (`id`, `id_usuario`, `nombre`, `monto`) VALUES
(1, 1, 'Luz + Internet', 37400.00),
(3, 1, 'Alquiler', 70000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

CREATE TABLE `detalle_pedidos` (
  `id` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `notas_personalizacion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `insumos`
--

CREATE TABLE `insumos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT 1,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `insumos`
--

INSERT INTO `insumos` (`id`, `id_usuario`, `nombre`, `precio`) VALUES
(1, 1, 'Pla Blanco', 12000.00),
(2, 1, 'PETG Negro', 14500.00),
(3, 1, 'Resina UV', 9800.00),
(4, 1, 'Caja kraft 1...', 350.00),
(5, 1, 'Billetera / Cuero', 7000.00),
(7, 1, 'Pistolera', 19800.00),
(8, 1, 'Guardabarro de Falcón', 79000.00),
(9, 1, 'cuero x metro', 16000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega` date NOT NULL,
  `estado` enum('Pendiente','En proceso','Listo','Entregado') NOT NULL,
  `metodo_pago` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock_actual` int(11) NOT NULL,
  `stock_minimo` int(11) NOT NULL,
  `precio_sugerido` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `id_usuario`, `nombre`, `descripcion`, `precio`, `stock_actual`, `stock_minimo`, `precio_sugerido`) VALUES
(6, 1, 'Bolso Matero', 'de los años 90', 1000.00, 5, 5, 0.00),
(7, 1, 'Bolsa de Yerba', 'De mi tia', 500.00, 15, 5, 0.00),
(13, 1, 'Pistolera', 'jlji', 20000.00, 3, 5, 15000.00),
(14, 1, 'Billetera', 'De river', 7000.00, 20, 5, 0.00),
(15, 1, 'cinturon', 'stone', 12000.00, 20, 5, 0.00),
(16, 1, 'tasdas', 'adsdasd', 0.03, 232314, 5, 0.00),
(17, 1, 'billetera', 'asdasd', 7000.00, 20, 5, 0.00),
(18, 1, 'Pistolera', 'dsadas', 500.00, 3, 5, 0.00),
(19, 1, 'dsadas', 'asdsa', 2000.00, 10, 5, 0.00),
(20, 1, 'asddsa', 'asdasdasd', 2323.00, 33, 5, 0.00),
(21, 1, 'asddsa', 'asdasdasd', 2323.00, 33, 5, 0.00),
(22, 1, 'dsadasdasda', 'asdasda', 500.00, 30, 5, 0.00),
(23, 1, 'dsadasdasda', 'asdasda', 500.00, 30, 5, 0.00),
(24, 1, 'Pistolera', 'De mi papa policia', 20000.00, 10, 5, 0.00),
(25, 1, 'Pistolera', 'De mi papa policia', 20000.00, 10, 5, 0.00),
(26, 1, 'dgfdgfg', 'fgdgdfg', 22222.00, 22, 5, 0.00),
(27, 1, 'dgfdgfg', 'fgdgdfg', 22222.00, 22, 5, 15000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rubros`
--

CREATE TABLE `rubros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `rubros`
--

INSERT INTO `rubros` (`id`, `nombre`) VALUES
(1, 'Marroquinería');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre_emprendimiento` varchar(150) NOT NULL,
  `id_rubro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `email`, `password`, `nombre_emprendimiento`, `id_rubro`) VALUES
(1, 'Usuario Demo', 'demo@emprendapp.com', '123456', 'Mi Taller', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `variantes_marroquineria`
--

CREATE TABLE `variantes_marroquineria` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `tipo_cuero` varchar(50) NOT NULL,
  `color` varchar(50) NOT NULL,
  `tamano` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `variantes_marroquineria`
--

INSERT INTO `variantes_marroquineria` (`id`, `id_producto`, `tipo_cuero`, `color`, `tamano`) VALUES
(5, 6, 'Vaca', 'Negro', '30x40cm'),
(6, 7, 'Oveja', 'Marrón claro', '50x35'),
(12, 13, 'Vaca', 'Negro', '3x15cm'),
(13, 14, 'Gamuza', 'Roja', '11x9cm'),
(14, 15, 'Vaca', 'Marrón', '100x3cm'),
(15, 16, 'Vaca', 'asdasdas', 'dasasd'),
(16, 17, 'Sintético', 'blanca', '11x9cm'),
(17, 18, 'Sintético', 'gfhdghdfg', '3x15cm'),
(18, 19, 'Vaca', 'asdasdaa', 'asdasd'),
(19, 20, 'Vaca', 'adsasd', 'asdasdd'),
(20, 21, 'Vaca', 'adsasd', 'asdasdd'),
(21, 22, 'Sintético', 'ddddd', 'sddsd'),
(22, 23, 'Sintético', 'ddddd', 'sddsd'),
(23, 24, 'Sintético', 'Negro', '3x15cm'),
(24, 25, 'Sintético', 'Negro', '3x15cm'),
(25, 26, 'Vaca', 'dfgdfggdfg', 'fdsfd'),
(26, 27, 'Vaca', 'dfgdfggdfg', 'fdsfd');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario_id` (`id_usuario`);

--
-- Indices de la tabla `costos_fijos`
--
ALTER TABLE `costos_fijos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detalle_pedido` (`id_pedido`),
  ADD KEY `fk_detalle_producto` (`id_producto`);

--
-- Indices de la tabla `insumos`
--
ALTER TABLE `insumos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pedido_usuario` (`id_usuario`),
  ADD KEY `fk_pedido_cliente` (`id_cliente`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_producto_usuario` (`id_usuario`);

--
-- Indices de la tabla `rubros`
--
ALTER TABLE `rubros`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_unico` (`email`),
  ADD KEY `fk_usuario_rubro` (`id_rubro`);

--
-- Indices de la tabla `variantes_marroquineria`
--
ALTER TABLE `variantes_marroquineria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_variante_producto` (`id_producto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `costos_fijos`
--
ALTER TABLE `costos_fijos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `insumos`
--
ALTER TABLE `insumos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `rubros`
--
ALTER TABLE `rubros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `variantes_marroquineria`
--
ALTER TABLE `variantes_marroquineria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `fk_usuario_id` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `costos_fijos`
--
ALTER TABLE `costos_fijos`
  ADD CONSTRAINT `costos_fijos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedido_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_producto_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rubro` FOREIGN KEY (`id_rubro`) REFERENCES `rubros` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `variantes_marroquineria`
--
ALTER TABLE `variantes_marroquineria`
  ADD CONSTRAINT `fk_variante_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
