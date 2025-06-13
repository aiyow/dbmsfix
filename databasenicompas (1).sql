-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2025 at 03:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `databasenicompas`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `role` varchar(50) DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `username`, `password`, `first_name`, `last_name`, `email`, `phone`, `address`, `role`) VALUES
(1, 'user1', '$2b$10$sSbUIYJcLduXqJQUk8mRquM3eMbECR/ruDxqXMQM8dLSlVGvufM1q', 'Juan', 'Cruz', 'juan@example.com', '09171234567', '123 Mabini St, Manila', 'customer'),
(2, 'user2', '$2b$10$VJaxGZpUEE3/.f81CQaKIeBckUp6DPp9kzmVtQQ7bfvHR1ZKo7eJW', 'Maria', 'Clara', 'maria@example.com', '09181234567', '456 Rizal Ave, Quezon City', 'customer'),
(3, 'ww', '$2b$10$mCOFHlLsxz8ap.UZmXo.Ju9bOllzm.9sAI4Ped3/5doBmXr2UiFSW', 'ww', 'ww', NULL, '223', 'ww', 'customer'),
(4, 'zzx', '$2b$10$i/6jD5iNHoii5gXZsLpcd.Jkac17DpklRISHuF/yptA1p117VlelK', 'zzx', 'zz', NULL, 'zz', 'zz', 'customer'),
(5, 'doc', '$2b$10$a1NGb/IkjFKsJrHwvt3F4uMLb64g9BxOqYiF05EAw7GvG/xICfrmy', 'prinz', 'doc', 'doc', 'doc', 'doc', 'customer'),
(6, 'qa', '$2b$10$5i6pcS9xSdDc9.hoUXx1Ae.6EwMqM9sneiXPqjNRiCBFeSM0L1BhC', 'za wurdo', 'qa', 'qa', '1231', 'qa', 'customer');

-- --------------------------------------------------------

--
-- Stand-in structure for view `inventory_report_view`
-- (See below for the actual view)
--
CREATE TABLE `inventory_report_view` (
`total_products` bigint(21)
,`out_of_stocks` bigint(21)
,`low_stock_product` bigint(21)
,`most_stocked_product` varchar(100)
);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `order_date`, `total_amount`) VALUES
(1, 1, '2025-06-08 16:56:54', 1997.00),
(2, 2, '2025-06-08 16:56:54', 1398.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 499.00),
(2, 1, 3, 1, 1499.00),
(3, 2, 2, 1, 899.00),
(4, 2, 4, 1, 199.00);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `payment_date` datetime DEFAULT current_timestamp(),
  `amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `order_id`, `payment_date`, `amount`) VALUES
(1, 1, '2025-06-08 16:56:54', 1997.00),
(2, 2, '2025-06-08 16:56:54', 1398.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `quantity`, `product_image`) VALUES
(1, 'Polo Shirt', 'Cotton polo shirt', 499.00, 100, 'images/products/polo.jpg'),
(2, 'Jeans', 'Denim blue jeans', 899.00, 50, 'images/products/jeans.jpg'),
(3, 'Sneakers', 'Running sneakers', 1499.00, 9, 'images/products/sneakers.jpg'),
(4, 'Cap', 'Baseball cap', 199.00, 0, 'images/products/cap.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `register`
--

CREATE TABLE `register` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `register`
--

INSERT INTO `register` (`id`, `username`, `password`, `role`) VALUES
(2, 'john_doe', 'securePassword123', 'admin'),
(3, 'Paldonis', '$2b$10$JouG.QOMxy6ayK9BjGgpz.CW5gQzMHYVCNpmRUytM9yFhwPuTBf7e', 'admin'),
(4, 'adonis', '$2b$10$GzFu220AgkgY0Dp1Zp8sWOOL9zwlGg8d7sQ.TqWYAWy/MErGvCL4O', 'Admin'),
(5, 'daniel', '$2b$10$Rr9uKT2axHwqHYLgC1B9m..S/pLo4cez6FPLCKdc32/U6tZ3nN8ZK', 'Admin'),
(13, 'aa', '$2b$10$hTRuKDtsrZHTuV10MCSqJ.XpTK3MfX9GfX8Ny/c9kNslbWlJOdZJy', 'staff'),
(14, 'qq', '$2b$10$0CH2qTM57wWAMIXqgjEzguyLhPTpuKE5F.8LEcBOqUURlsrr8X8GW', 'admin'),
(15, 'zz', '$2b$10$vteRRrUmj08C.o9Zu91TwOP.ZytF4OnnYd1Gr9IPv8lQgKBPfQDLS', 'staff'),
(16, 'ss', '$2b$10$8zqALlPLJoT2iOzPCEJwcOvWVQhxrwLAqGUvUvZOa5FrhQMVpGjX.', 'staff'),
(17, 'aad', '$2b$10$GDLMaK5.rABokPzeMsUPtuQnwXameOpyO.V4URTnBcZhOztBI212W', 'staff'),
(18, 'aas', '$2b$10$L7Cg.eLmOKyLFyNvKP22h.TWQ7zftuF5TK/0pW9nz5.vzFgcWp7P6', 'staff'),
(19, 'sd', '$2b$10$seRc/5G3XS6Q9cdoj1/56Omc4TAAOMd15zbHjFPFEYEzSWv2rXntW', 'admin'),
(20, 'qwe', '$2b$10$nSJOyM5BHS9.aBGYePHjle5QfQ2t7cvQnFBm7vUITtBbRpkiKmJaK', 'admin'),
(21, 'qe', '$2b$10$lUIss3oK697/6lRqaZL.k.cSHtg6cbxH5CFBPsRCHVvNZS5OfWFNW', 'staff');

-- --------------------------------------------------------

--
-- Stand-in structure for view `sales_report_view`
-- (See below for the actual view)
--
CREATE TABLE `sales_report_view` (
`total_sales_today` decimal(32,2)
,`total_sales_week` decimal(32,2)
,`total_sales_month` decimal(32,2)
,`number_of_orders_today` bigint(21)
,`number_of_orders_week` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `action_type` enum('Completed','Pending','Refunded') DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `transaction_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `product_id`, `action_type`, `quantity`, `transaction_date`) VALUES
(1, 1, 'Completed', 2, '2025-06-08 16:56:54'),
(2, 3, 'Completed', 1, '2025-06-08 16:56:54'),
(3, 2, 'Pending', 1, '2025-06-08 16:56:54'),
(4, 4, 'Refunded', 1, '2025-06-08 16:56:54');

-- --------------------------------------------------------

--
-- Stand-in structure for view `transaction_report_view`
-- (See below for the actual view)
--
CREATE TABLE `transaction_report_view` (
`total_transactions` bigint(21)
,`pending_transaction` bigint(21)
,`completed_transaction` bigint(21)
,`refunded_transaction` bigint(21)
);

-- --------------------------------------------------------

--
-- Structure for view `inventory_report_view`
--
DROP TABLE IF EXISTS `inventory_report_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `inventory_report_view`  AS SELECT count(0) AS `total_products`, count(case when `products`.`quantity` = 0 then 1 end) AS `out_of_stocks`, count(case when `products`.`quantity` between 1 and 10 then 1 end) AS `low_stock_product`, (select `products`.`name` from `products` order by `products`.`quantity` desc limit 1) AS `most_stocked_product` FROM `products` ;

-- --------------------------------------------------------

--
-- Structure for view `sales_report_view`
--
DROP TABLE IF EXISTS `sales_report_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `sales_report_view`  AS SELECT sum(`o`.`total_amount`) AS `total_sales_today`, sum(case when cast(`o`.`order_date` as date) >= curdate() - interval 7 day then `o`.`total_amount` else 0 end) AS `total_sales_week`, sum(case when month(`o`.`order_date`) = month(curdate()) and year(`o`.`order_date`) = year(curdate()) then `o`.`total_amount` else 0 end) AS `total_sales_month`, count(case when cast(`o`.`order_date` as date) = curdate() then 1 end) AS `number_of_orders_today`, count(case when `o`.`order_date` >= curdate() - interval 7 day then 1 end) AS `number_of_orders_week` FROM `orders` AS `o` ;

-- --------------------------------------------------------

--
-- Structure for view `transaction_report_view`
--
DROP TABLE IF EXISTS `transaction_report_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `transaction_report_view`  AS SELECT count(0) AS `total_transactions`, count(case when `transactions`.`action_type` = 'Pending' then 1 end) AS `pending_transaction`, count(case when `transactions`.`action_type` = 'Completed' then 1 end) AS `completed_transaction`, count(case when `transactions`.`action_type` = 'Refunded' then 1 end) AS `refunded_transaction` FROM `transactions` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `register`
--
ALTER TABLE `register`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `register`
--
ALTER TABLE `register`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
