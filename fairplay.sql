-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 29, 2023 at 09:38 AM
-- Server version: 10.3.28-MariaDB-cll-lve
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fairplay`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `position_id` int(11) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `firstname`, `position_id`, `registration_date`, `lastname`) VALUES
(1, 'Joaquin', 1, '2010-10-20', 'Montero'),
(2, 'Pepito', 1, '2013-02-11', 'Calaca'),
(3, 'Carlito', 1, '2009-10-20', 'Mapungay'),
(4, 'Eddie', 1, '2016-06-02', 'Gobas'),
(5, 'Marie', 1, '2008-01-08', 'Zaragoza'),
(6, 'Aliano', 2, '2003-12-02', 'Dela Cruz'),
(7, 'John Mark', 3, '1999-08-25', 'Macas'),
(8, 'Miya', 4, '1980-02-21', 'Tan'),
(9, 'Ferly', 5, '2002-11-03', 'Laguna'),
(10, 'Rafaela', 2, '2004-06-20', 'Lopez'),
(11, 'Kurty', 3, '1999-02-22', 'Anderson'),
(12, 'Aurora', 4, '1993-11-21', 'Garcia'),
(13, 'Clara', 5, '2000-04-05', 'Fernandez'),
(14, 'Sophia', 2, '2012-05-15', 'Garcia'),
(15, 'Liam', 2, '2015-09-03', 'Rodriguez'),
(16, 'Isabella', 2, '2008-12-10', 'Martinez'),
(17, 'Noah', 2, '2013-07-28', 'Lopez'),
(18, 'Emma', 2, '2011-03-12', 'Hernandez'),
(19, 'Oliver', 2, '2009-06-25', 'Gonzalez'),
(20, 'Ava', 2, '2014-02-18', 'Perez'),
(21, 'Ethan', 2, '2016-11-05', 'Torres'),
(22, 'Mia', 2, '2007-08-13', 'Rivera'),
(23, 'Lucas', 2, '2019-04-02', 'Morales'),
(24, 'Charlotte', 2, '2006-01-29', 'Sanchez'),
(25, 'Alexander', 2, '2017-10-16', 'Ramirez'),
(26, 'Amelia', 2, '2005-03-07', 'Reyes'),
(27, 'Benjamin', 2, '2018-12-24', 'Cruz'),
(28, 'Harper', 2, '2004-09-10', 'Ortega'),
(29, 'Elijah', 2, '2022-06-17', 'Delgado'),
(30, 'Elizabeth', 2, '2003-11-01', 'Castillo'),
(31, 'Sebastian', 2, '2021-08-08', 'Jimenez'),
(32, 'Abigail', 2, '2002-04-03', 'Vargas'),
(33, 'Daniela', 3, '2021-05-11', 'Canuna'),
(34, 'Dionbert', 3, '2015-11-15', 'Go'),
(35, 'Aliana', 4, '2008-09-30', 'Carampel'),
(36, 'Joy Ellie', 4, '2015-02-14', 'Somero'),
(37, 'Kurtney', 4, '2019-08-22', 'Molina');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` int(11) NOT NULL,
  `position_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `position_name`) VALUES
(1, 'Barangay Captain'),
(2, 'Sangguniang Barangay'),
(3, 'Barangay Secretary'),
(4, 'Barangay Treasurer');

-- --------------------------------------------------------

--
-- Table structure for table `registered_users`
--

CREATE TABLE `registered_users` (
  `lastname` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `voter_id` int(10) NOT NULL,
  `registration_date` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `registered_users`
--

INSERT INTO `registered_users` (`lastname`, `firstname`, `address`, `birthdate`, `email`, `voter_id`, `registration_date`) VALUES
('Moleno', 'Kurt', 'dito lang', '2001-10-21', 'kurtourage@gmail.com', 7, '2021-11-11'),
('Montero', 'Joaquin', '7 Antonio Villa Street, Kaytapos', '1967-10-20', 'joaquin@gmail.com', 8, '2023-05-28'),
('Calaca', 'Pepito', '12 Upland, Kaytapos', '1990-02-11', 'pepito@gmail.com', 9, '2023-05-25'),
('Mapungay', 'Carlito', '3 A. Luna Street, Kaytapos', '1990-10-20', 'carlito@gmail.com', 10, '2023-05-27'),
('Gobas', 'Eddie', '22 A. Mabini Street, Kaytapos', '1996-06-02', 'eddie@gmail.com', 11, '2023-05-26'),
('Zaragoza', 'Marie', '15 A. Mojica Street, Kaytapos', '1998-01-08', 'marie@gmail.com', 12, '2023-05-29'),
('Dela Cruz', 'Aliano', '9 Antonio Villa Street, Kaytapos', '1983-12-02', 'aliano@gmail.com', 13, '2023-05-30'),
('Macas', 'John Mark', '18 Upland, Kaytapos', '1999-08-25', 'johnmark@gmail.com', 14, '2023-05-28'),
('Tan', 'Miya', '5 A. Luna Street, Kaytapos', '1980-02-21', 'miya@gmail.com', 15, '2023-05-27'),
('Laguna', 'Ferly', '10 A. Mabini Street, Kaytapos', '1972-11-03', 'ferly@gmail.com', 16, '2023-05-26'),
('Lopez', 'Rafaela', '2 A. Mojica Street, Kaytapos', '1984-06-20', 'rafaela@gmail.com', 17, '2023-05-29'),
('Anderson', 'Kurty', '8 Antonio Villa Street, Kaytapos', '1999-02-22', 'kurty@gmail.com', 18, '2023-05-30'),
('Garcia', 'Aurora', '16 Upland, Kaytapos', '1993-11-21', 'aurora@gmail.com', 19, '2023-05-28'),
('Fernandez', 'Clara', '4 A. Luna Street, Kaytapos', '2000-04-05', 'clara@gmail.com', 20, '2023-05-27'),
('Garcia', 'Sophia', '11 A. Mabini Street, Kaytapos', '1992-05-15', 'sophia@gmail.com', 21, '2023-05-26'),
('Rodriguez', 'Liam', '6 A. Mojica Street, Kaytapos', '1995-09-03', 'liam@gmail.com', 22, '2023-05-29'),
('Martinez', 'Isabella', '14 Antonio Villa Street, Kaytapos', '1988-12-10', 'isabella@gmail.com', 23, '2023-05-30'),
('Lopez', 'Noah', '20 Upland, Kaytapos', '1983-07-28', 'noah@gmail.com', 24, '2023-05-28'),
('Hernandez', 'Emma', '1 A. Luna Street, Kaytapos', '1981-03-12', 'emma@gmail.com', 25, '2023-05-27'),
('Gonzalez', 'Oliver', '17 A. Mabini Street, Kaytapos', '1989-06-25', 'oliver@gmail.com', 26, '2023-05-26'),
('Perez', 'Ava', '13 A. Mojica Street, Kaytapos', '1984-02-18', 'ava@gmail.com', 27, '2023-05-29'),
('Torres', 'Ethan', '19 Antonio Villa Street, Kaytapos', '1986-11-05', 'ethan@gmail.com', 28, '2023-05-30'),
('Rivera', 'Mia', '3 Upland, Kaytapos', '1987-08-13', 'mia@gmail.com', 29, '2023-05-28'),
('Morales', 'Lucas', '10 A. Luna Street, Kaytapos', '1979-04-02', 'lucas@gmail.com', 30, '2023-05-27'),
('Sanchez', 'Charlotte', '7 A. Mabini Street, Kaytapos', '1986-01-29', 'charlotte@gmail.com', 31, '2023-05-26'),
('Ramirez', 'Alexander', '12 A. Mojica Street, Kaytapos', '1987-10-16', 'alexander@gmail.com', 32, '2023-05-29'),
('Reyes', 'Amelia', '8 Antonio Villa Street, Kaytapos', '1995-03-07', 'amelia@gmail.com', 33, '2023-05-30'),
('Cruz', 'Benjamin', '16 Upland, Kaytapos', '1998-12-24', 'benjamin@gmail.com', 34, '2023-05-28'),
('Ortega', 'Harper', '4 A. Luna Street, Kaytapos', '1994-09-10', 'harper@gmail.com', 35, '2023-05-27'),
('Delgado', 'Elijah', '11 A. Mabini Street, Kaytapos', '1992-06-17', 'elijah@gmail.com', 36, '2023-05-26'),
('Castillo', 'Elizabeth', '6 A. Mojica Street, Kaytapos', '1973-11-01', 'elizabeth@gmail.com', 37, '2023-05-29'),
('Jimenez', 'Sebastian', '14 Antonio Villa Street, Kaytapos', '1991-08-08', 'sebastian@gmail.com', 38, '2023-05-30'),
('Perez', 'Victoria', '20 Upland, Kaytapos', '1989-03-04', 'victoria@gmail.com', 39, '2023-05-28'),
('Gomez', 'David', '1 A. Luna Street, Kaytapos', '1987-07-21', 'david@gmail.com', 40, '2023-05-27'),
('Hernandez', 'Grace', '17 A. Mabini Street, Kaytapos', '1990-04-14', 'grace@gmail.com', 41, '2023-05-26'),
('Torres', 'Joseph', '13 A. Mojica Street, Kaytapos', '1993-01-12', 'joseph@gmail.com', 42, '2023-05-29'),
('San', 'Emma', '5 Antonio Villa Street, Kaytapos', '1993-05-19', 'emmasan440@gmail.com', 43, '2023-05-29'),
('Bogsa', 'Joshua', 'Kaytapos', '1212-12-12', 'joshua@gmail.com', 44, '1212-12-12'),
('Licious', 'Owa', 'Kaytapos', '1212-12-12', 'owa@gmail.com', 45, '1212-12-12'),
('Ey', 'Bri', 'Kaytapos', '1212-12-12', 'bri@gmail.com', 46, '1212-12-12'),
('Gatdula', 'Odie', 'Kaytapos', '1212-12-12', 'odie@gmail.com', 47, '1212-12-12'),
('Taasan', 'Jessa', 'Kaytapos', '1212-12-12', 'jessa@gmail.com', 48, '1212-12-12'),
('Crooc', 'Layla', 'Kaytapos', '1212-12-12', 'layla@gmail.com', 49, '1212-12-12'),
('Cueno', 'Trisha', 'Kaytapos', '1212-12-12', 'trisha@gmail.com', 50, '1212-12-12'),
('Cat', 'Dash', 'Kaytapos', '1212-12-12', 'krystal@gmail.com', 51, '1212-12-12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `lastname` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `id` int(10) NOT NULL,
  `registration_date` date DEFAULT NULL,
  `has_voted` int(1) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`lastname`, `firstname`, `address`, `birthdate`, `user_type`, `email`, `password`, `id`, `registration_date`, `has_voted`) VALUES
('Doe', 'John', 'Barangay Tibay', '2001-10-10', 'Admin', 'appc.org@gmail.com', '23962a8f0f0bf2ce57609ca5c79d4df8', 1, NULL, 1),
('Moleno', 'Kurt', 'dito lang', '2001-10-21', 'Voter', 'kurtourage@gmail.com', '202cb962ac59075b964b07152d234b70', 7, '2021-11-11', 1),
('Montero', 'Joaquin', '7 Antonio Villa Street, Kaytapos', '1967-10-20', 'Voter', 'joaquin@gmail.com', '6a08e98ba4e91004efdfb51fe525e7fc', 8, '2023-05-28', 1),
('Calaca', 'Pepito', '12 Upland, Kaytapos', '1990-02-11', 'Voter', 'pepito@gmail.com', 'dff4d900adaac86c6db2f24313886b78', 9, '2023-05-25', 0),
('Mapungay', 'Carlito', '3 A. Luna Street, Kaytapos', '1990-10-20', 'Voter', 'carlito@gmail.com', '5c1f8c69e4811a6f6124f98cd94cecf0', 10, '2023-05-27', 0),
('Gobas', 'Eddie', '22 A. Mabini Street, Kaytapos', '1996-06-02', 'Voter', 'eddie@gmail.com', 'b160aa4a216077ed71fb5d50b29538f9', 11, '2023-05-26', 0),
('Zaragoza', 'Marie', '15 A. Mojica Street, Kaytapos', '1998-01-08', 'Voter', 'marie@gmail.com', 'c7c3ab7a88101ef3173d6dcad8976213', 12, '2023-05-29', 1),
('Dela Cruz', 'Aliano', '9 Antonio Villa Street, Kaytapos', '1983-12-02', 'Voter', 'aliano@gmail.com', '3517ac4fbda7502051fc6bfc8254b0e7', 13, '2023-05-30', 0),
('Macas', 'John Mark', '18 Upland, Kaytapos', '1999-08-25', 'Voter', 'johnmark@gmail.com', '46060347e9cda3ec0d07c5db12186da5', 14, '2023-05-28', 0),
('Tan', 'Miya', '5 A. Luna Street, Kaytapos', '1980-02-21', 'Voter', 'miya@gmail.com', '1df3eb68d291ec74c3a48d04a65f34e3', 15, '2023-05-27', 0),
('Laguna', 'Ferly', '10 A. Mabini Street, Kaytapos', '1972-11-03', 'Voter', 'ferly@gmail.com', '3c7a55b92779cdcfa9cad40a4c6d529e', 16, '2023-05-26', 0),
('Lopez', 'Rafaela', '2 A. Mojica Street, Kaytapos', '1984-06-20', 'Voter', 'rafaela@gmail.com', 'd56db0999f4daf5536bbab700a2fa07b', 17, '2023-05-29', 0),
('Anderson', 'Kurty', '8 Antonio Villa Street, Kaytapos', '1999-02-22', 'Voter', 'kurty@gmail.com', '818ee897332400ae0beb9eedcbd8ff13', 18, '2023-05-30', 0),
('Garcia', 'Aurora', '16 Upland, Kaytapos', '1993-11-21', 'Voter', 'aurora@gmail.com', 'faaa3d50e932ee8afaac88991dc33b1e', 19, '2023-05-28', 0),
('Fernandez', 'Clara', '4 A. Luna Street, Kaytapos', '2000-04-05', 'Voter', 'clara@gmail.com', '1a076223d26217fc6547cfe228e174ca', 20, '2023-05-27', 0),
('Garcia', 'Sophia', '11 A. Mabini Street, Kaytapos', '1992-05-15', 'Voter', 'sophia@gmail.com', '8b1c01a333cb0eb8378b0591ab420bca', 21, '2023-05-26', 0),
('Rodriguez', 'Liam', '6 A. Mojica Street, Kaytapos', '1995-09-03', 'Voter', 'liam@gmail.com', 'a68b55033f9e6f5bafd9d2607249e519', 22, '2023-05-29', 0),
('Martinez', 'Isabella', '14 Antonio Villa Street, Kaytapos', '1988-12-10', 'Voter', 'isabella@gmail.com', 'e05ce7324f0c483ba286c0f02e86227a', 23, '2023-05-30', 0),
('Lopez', 'Noah', '20 Upland, Kaytapos', '1983-07-28', 'Voter', 'noah@gmail.com', '77cf518b06d611f1d659fedb7cab0765', 24, '2023-05-28', 0),
('Hernandez', 'Emma', '1 A. Luna Street, Kaytapos', '1981-03-12', 'Voter', 'emma@gmail.com', '00927285e471e57826b61f83773e0391', 25, '2023-05-27', 0),
('Gonzalez', 'Oliver', '17 A. Mabini Street, Kaytapos', '1989-06-25', 'Voter', 'oliver@gmail.com', 'c8045bf5f69ccf6d6b707ba805754ca6', 26, '2023-05-26', 0),
('Perez', 'Ava', '13 A. Mojica Street, Kaytapos', '1984-02-18', 'Voter', 'ava@gmail.com', '52d2f454724cc8304f72ee855ca859fe', 27, '2023-05-29', 0),
('Torres', 'Ethan', '19 Antonio Villa Street, Kaytapos', '1986-11-05', 'Voter', 'ethan@gmail.com', '3ef6e808859632f0622250f86d23a60c', 28, '2023-05-30', 0),
('Rivera', 'Mia', '3 Upland, Kaytapos', '1987-08-13', 'Voter', 'mia@gmail.com', 'f43f295e9f267be7314e5ea482d338b5', 29, '2023-05-28', 0),
('Morales', 'Lucas', '10 A. Luna Street, Kaytapos', '1979-04-02', 'Voter', 'lucas@gmail.com', '1c048c0b76dc4b07e4d10f9d4bfa4179', 30, '2023-05-27', 0),
('Sanchez', 'Charlotte', '7 A. Mabini Street, Kaytapos', '1986-01-29', 'Voter', 'charlotte@gmail.com', '34a8c899ca882ccdc2f5c34db7ed7760', 31, '2023-05-26', 0),
('Ramirez', 'Alexander', '12 A. Mojica Street, Kaytapos', '1987-10-16', 'Voter', 'alexander@gmail.com', '1f39db5796e1d081440a1c1ea7b2f164', 32, '2023-05-29', 0),
('Reyes', 'Amelia', '8 Antonio Villa Street, Kaytapos', '1995-03-07', 'Voter', 'amelia@gmail.com', '8d31fedf1eaec9c85df5761a3f4f6797', 33, '2023-05-30', 0),
('Cruz', 'Benjamin', '16 Upland, Kaytapos', '1998-12-24', 'Voter', 'benjamin@gmail.com', '56a87f89461b07fe5e7cb95d2be3dc19', 34, '2023-05-28', 0),
('Ortega', 'Harper', '4 A. Luna Street, Kaytapos', '1994-09-10', 'Voter', 'harper@gmail.com', '6a29aff40ecf0b7564a6c91f7b8cc609', 35, '2023-05-27', 0),
('Delgado', 'Elijah', '11 A. Mabini Street, Kaytapos', '1992-06-17', 'Voter', 'elijah@gmail.com', '43535f458616801a74c65325617a597a', 36, '2023-05-26', 0),
('Castillo', 'Elizabeth', '6 A. Mojica Street, Kaytapos', '1973-11-01', 'Voter', 'elizabeth@gmail.com', '6085123beef582cc3bc7b3d474f684d9', 37, '2023-05-29', 0),
('Jimenez', 'Sebastian', '14 Antonio Villa Street, Kaytapos', '1991-08-08', 'Voter', 'sebastian@gmail.com', '59c69ab1697dbcadcc8a758c1392fd07', 38, '2023-05-30', 0),
('Perez', 'Victoria', '20 Upland, Kaytapos', '1989-03-04', 'Voter', 'victoria@gmail.com', '4c0fd3e821b5130c80e7b294fedb02c5', 39, '2023-05-28', 0),
('Gomez', 'David', '1 A. Luna Street, Kaytapos', '1987-07-21', 'Voter', 'david@gmail.com', '2485814f705777715323cdf8a330e0fd', 40, '2023-05-27', 0),
('Hernandez', 'Grace', '17 A. Mabini Street, Kaytapos', '1990-04-14', 'Voter', 'grace@gmail.com', '4f6aabb31b4a4bd3570c1ab12738e21a', 41, '2023-05-26', 0),
('Torres', 'Joseph', '13 A. Mojica Street, Kaytapos', '1993-01-12', 'Voter', 'joseph@gmail.com', '25525dfaec6af1265bda1fc883b1673d', 42, '2023-05-29', 0),
('San', 'Emma', '5 Antonio Villa Street, Kaytapos', '1993-05-19', 'Voter', 'emmasan440@gmail.com', '25d55ad283aa400af464c76d713c07ad', 43, '2023-05-29', 0),
('Cat', 'Dash', 'Kaytapos', '1212-12-12', 'Voter', 'krystal@gmail.com', '25d55ad283aa400af464c76d713c07ad', 51, '1212-12-12', 1),
('Bogsa', 'Joshua', 'Kaytapos', '1212-12-12', 'Voter', 'joshua@gmail.com', '25d55ad283aa400af464c76d713c07ad', 44, '1212-12-12', 1),
('Licious', 'Owa', 'Kaytapos', '1212-12-12', 'Voter', 'owa@gmail.com', '25d55ad283aa400af464c76d713c07ad', 45, '1212-12-12', 1),
('Ey', 'Bri', 'Kaytapos', '1212-12-12', 'Voter', 'bri@gmail.com', '25d55ad283aa400af464c76d713c07ad', 46, '1212-12-12', 1),
('Gatdula', 'Odie', 'Kaytapos', '1212-12-12', 'Voter', 'odie@gmail.com', '25d55ad283aa400af464c76d713c07ad', 47, '1212-12-12', 1),
('Taasan', 'Jessa', 'Kaytapos', '1212-12-12', 'Voter', 'jessa@gmail.com', '25d55ad283aa400af464c76d713c07ad', 48, '1212-12-12', 1),
('Crooc', 'Layla', 'Kaytapos', '1212-12-12', 'Voter', 'layla@gmail.com', '25d55ad283aa400af464c76d713c07ad', 49, '1212-12-12', 0),
('Cueno', 'Trisha', 'Kaytapos', '1212-12-12', 'Voter', 'trisha@gmail.com', '25d55ad283aa400af464c76d713c07ad', 50, '1212-12-12', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_votes`
--

CREATE TABLE `user_votes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `position_id` int(11) DEFAULT NULL,
  `candidate_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_votes`
--

INSERT INTO `user_votes` (`id`, `user_id`, `position_id`, `candidate_id`) VALUES
(1, 7, 1, 1),
(2, 7, 2, 6),
(3, 7, 3, 7),
(4, 7, 4, 8),
(5, 7, 1, 1),
(6, 7, 2, 6),
(7, 7, 3, 7),
(8, 7, 4, 8),
(9, 7, 1, 1),
(10, 7, 2, 6),
(11, 7, 3, 7),
(12, 7, 4, 8),
(13, 7, 1, 1),
(14, 7, 2, 6),
(15, 7, 3, 7),
(16, 7, 4, 8),
(17, 7, 1, 1),
(18, 7, 2, 6),
(19, 7, 3, 7),
(20, 7, 4, 8),
(21, 7, 1, 1),
(22, 7, 2, 6),
(23, 7, 3, 7),
(24, 7, 4, 8),
(25, 7, 1, 1),
(26, 7, 2, 6),
(27, 7, 3, 7),
(28, 7, 4, 8),
(29, 7, 1, 1),
(30, 7, 2, 6),
(31, 7, 3, 7),
(32, 7, 4, 8),
(33, 7, 1, 1),
(34, 7, 2, 6),
(35, 7, 3, 7),
(36, 7, 4, 8),
(37, 7, 1, 1),
(38, 7, 2, 6),
(39, 7, 2, 10),
(40, 7, 2, 14),
(41, 7, 2, 15),
(42, 7, 2, 16),
(43, 7, 2, 17),
(44, 7, 2, 18),
(45, 7, 3, 7),
(46, 7, 4, 8),
(47, 7, 1, 1),
(48, 7, 2, 6),
(49, 7, 2, 10),
(50, 7, 2, 14),
(51, 7, 2, 15),
(52, 7, 2, 16),
(53, 7, 2, 17),
(54, 7, 2, 18),
(55, 7, 3, 7),
(56, 7, 4, 8),
(57, 7, 1, 1),
(58, 7, 2, 10),
(59, 7, 2, 14),
(60, 7, 2, 16),
(61, 7, 3, 7),
(62, 7, 4, 8),
(63, 7, 1, 1),
(64, 7, 2, 10),
(65, 7, 2, 14),
(66, 7, 2, 16),
(67, 7, 3, 7),
(68, 7, 4, 8),
(69, 7, 1, 1),
(70, 7, 2, 6),
(71, 7, 2, 10),
(72, 7, 2, 15),
(73, 7, 2, 18),
(74, 7, 3, 7),
(75, 7, 4, 8),
(76, 7, 1, 1),
(77, 7, 2, 6),
(78, 7, 2, 10),
(79, 7, 2, 15),
(80, 7, 2, 18),
(81, 7, 3, 7),
(82, 7, 4, 8),
(83, 7, 1, 1),
(84, 7, 2, 6),
(85, 7, 2, 10),
(86, 7, 2, 14),
(87, 7, 2, 15),
(88, 7, 2, 16),
(89, 7, 2, 18),
(90, 7, 2, 19),
(91, 7, 3, 7),
(92, 7, 4, 8),
(93, 7, 1, 1),
(94, 7, 2, 6),
(95, 7, 2, 10),
(96, 7, 2, 14),
(97, 7, 2, 15),
(98, 7, 2, 16),
(99, 7, 2, 18),
(100, 7, 2, 19),
(101, 7, 3, 7),
(102, 7, 4, 8),
(103, 43, 1, 3),
(104, 43, 2, 21),
(105, 43, 2, 22),
(106, 43, 2, 27),
(107, 43, 2, 29),
(108, 43, 2, 30),
(109, 43, 2, 31),
(110, 43, 2, 32),
(111, 43, 3, 11),
(112, 43, 4, 8),
(113, 43, 1, 3),
(114, 43, 2, 21),
(115, 43, 2, 22),
(116, 43, 2, 27),
(117, 43, 2, 29),
(118, 43, 2, 30),
(119, 43, 2, 31),
(120, 43, 2, 32),
(121, 43, 3, 11),
(122, 43, 4, 8),
(123, 44, 1, 1),
(124, 44, 2, 6),
(125, 44, 2, 10),
(126, 44, 2, 20),
(127, 44, 2, 23),
(128, 44, 2, 25),
(129, 44, 2, 29),
(130, 44, 2, 30),
(131, 44, 3, 7),
(132, 44, 4, 8),
(133, 44, 1, 1),
(134, 44, 2, 6),
(135, 44, 2, 10),
(136, 44, 2, 20),
(137, 44, 2, 23),
(138, 44, 2, 25),
(139, 44, 2, 29),
(140, 44, 2, 30),
(141, 44, 3, 7),
(142, 44, 4, 8),
(143, 45, 1, 1),
(144, 45, 2, 31),
(145, 45, 3, 7),
(146, 45, 4, 36),
(147, 45, 1, 1),
(148, 45, 2, 31),
(149, 45, 3, 7),
(150, 45, 4, 36),
(151, 47, 1, 1),
(152, 47, 2, 10),
(153, 47, 2, 14),
(154, 47, 2, 15),
(155, 47, 2, 19),
(156, 47, 2, 21),
(157, 47, 2, 31),
(158, 47, 2, 32),
(159, 47, 3, 7),
(160, 47, 4, 8),
(161, 47, 1, 1),
(162, 47, 2, 10),
(163, 47, 2, 14),
(164, 47, 2, 15),
(165, 47, 2, 19),
(166, 47, 2, 21),
(167, 47, 2, 31),
(168, 47, 2, 32),
(169, 47, 3, 7),
(170, 47, 4, 8),
(171, 7, 1, 1),
(172, 7, 2, 16),
(173, 7, 2, 18),
(174, 7, 2, 20),
(175, 7, 3, 7),
(176, 7, 4, 8),
(177, 7, 1, 1),
(178, 7, 2, 16),
(179, 7, 2, 18),
(180, 7, 2, 20),
(181, 7, 3, 7),
(182, 7, 4, 8),
(183, 49, 1, 1),
(184, 49, 2, 10),
(185, 49, 2, 15),
(186, 49, 2, 16),
(187, 49, 2, 18),
(188, 49, 2, 19),
(189, 49, 2, 20),
(190, 49, 2, 21),
(191, 49, 3, 7),
(192, 49, 4, 8),
(193, 49, 1, 1),
(194, 49, 2, 10),
(195, 49, 2, 15),
(196, 49, 2, 16),
(197, 49, 2, 18),
(198, 49, 2, 19),
(199, 49, 2, 20),
(200, 49, 2, 21),
(201, 49, 3, 7),
(202, 49, 4, 8),
(203, 50, 1, 4),
(204, 50, 2, 14),
(205, 50, 2, 17),
(206, 50, 2, 18),
(207, 50, 2, 20),
(208, 50, 2, 27),
(209, 50, 2, 28),
(210, 50, 3, 34),
(211, 50, 4, 35),
(217, 51, 1, 4),
(218, 51, 2, 22),
(219, 51, 2, 23),
(220, 51, 2, 24),
(221, 51, 2, 25),
(222, 51, 3, 34),
(223, 51, 4, 35),
(224, 52, 1, 1),
(225, 52, 2, 6),
(226, 52, 2, 10),
(227, 52, 3, 7),
(228, 52, 4, 37),
(229, 52, 1, 1),
(230, 52, 2, 6),
(231, 52, 2, 10),
(232, 52, 3, 7),
(233, 52, 4, 37),
(234, 52, 1, 1),
(235, 52, 2, 6),
(236, 52, 2, 10),
(237, 52, 3, 7),
(238, 52, 4, 35),
(239, 52, 1, 1),
(240, 52, 2, 6),
(241, 52, 2, 10),
(242, 52, 2, 15),
(243, 52, 2, 16),
(244, 52, 3, 7),
(245, 52, 4, 35),
(246, 52, 1, 1),
(247, 52, 2, 6),
(248, 52, 2, 10),
(249, 52, 2, 15),
(250, 52, 2, 16),
(251, 52, 2, 18),
(252, 52, 3, 7),
(253, 52, 4, 35),
(254, 53, 1, 1),
(255, 53, 2, 27),
(256, 53, 2, 28),
(257, 53, 2, 29),
(258, 53, 3, 34),
(259, 53, 4, 12),
(260, 54, 1, 1),
(261, 54, 2, 10),
(262, 54, 3, 33),
(263, 54, 4, 8),
(264, 54, 1, 2),
(265, 54, 2, 6),
(266, 54, 3, 11),
(267, 54, 4, 8),
(268, 55, 1, 4),
(269, 55, 2, 18),
(270, 55, 2, 19),
(271, 55, 2, 20),
(272, 55, 2, 22),
(273, 55, 2, 23),
(274, 55, 2, 24),
(275, 55, 3, 34),
(276, 55, 4, 35),
(277, 55, 1, 3),
(278, 55, 2, 16),
(279, 55, 2, 17),
(280, 55, 2, 18),
(281, 55, 2, 26),
(282, 55, 2, 27),
(283, 55, 3, 34),
(284, 55, 4, 35),
(285, 56, 1, 1),
(286, 56, 2, 15),
(287, 56, 2, 16),
(288, 56, 2, 17),
(289, 56, 2, 19),
(290, 56, 2, 20),
(291, 56, 2, 21),
(292, 56, 2, 29),
(293, 56, 3, 33),
(294, 56, 4, 12),
(295, 56, 1, 1),
(296, 56, 2, 15),
(297, 56, 2, 16),
(298, 56, 2, 17),
(299, 56, 2, 19),
(300, 56, 2, 20),
(301, 56, 2, 21),
(302, 56, 2, 29),
(303, 56, 3, 33),
(304, 56, 4, 12),
(305, 56, 1, 1),
(306, 56, 2, 6),
(307, 56, 2, 10),
(308, 56, 2, 15),
(309, 56, 2, 16),
(310, 56, 2, 17),
(311, 56, 2, 21),
(312, 56, 2, 23),
(313, 56, 3, 33),
(314, 56, 4, 12),
(315, 56, 1, 1),
(316, 56, 2, 6),
(317, 56, 2, 10),
(318, 56, 2, 15),
(319, 56, 2, 16),
(320, 56, 2, 25),
(321, 56, 2, 26),
(322, 56, 2, 27),
(323, 56, 3, 33),
(324, 56, 4, 12),
(325, 56, 1, 3),
(326, 56, 2, 17),
(327, 56, 2, 18),
(328, 56, 2, 19),
(329, 56, 2, 20),
(330, 56, 2, 21),
(331, 56, 2, 22),
(332, 56, 2, 23),
(333, 56, 3, 34),
(334, 56, 4, 8),
(335, 57, 1, 5),
(336, 57, 2, 21),
(337, 57, 3, 7),
(338, 57, 4, 36),
(339, 58, 1, 4),
(340, 58, 2, 6),
(341, 58, 2, 10),
(342, 58, 2, 14),
(343, 58, 2, 21),
(344, 58, 2, 22),
(345, 58, 2, 23),
(346, 58, 2, 27),
(347, 58, 3, 7),
(348, 58, 4, 36),
(349, 62, 1, 2),
(350, 62, 2, 6),
(351, 62, 2, 10),
(352, 62, 2, 14),
(353, 62, 2, 15),
(354, 62, 2, 16),
(355, 62, 2, 17),
(356, 62, 2, 18),
(357, 62, 2, 19),
(358, 62, 2, 20),
(359, 62, 2, 21),
(360, 62, 2, 22),
(361, 62, 2, 23),
(362, 62, 2, 24),
(363, 62, 2, 25),
(364, 62, 2, 26),
(365, 62, 2, 27),
(366, 62, 2, 28),
(367, 62, 2, 30),
(368, 62, 2, 32),
(369, 62, 3, 11),
(370, 62, 4, 35),
(371, 64, 1, 3),
(372, 64, 2, 10),
(373, 64, 2, 14),
(374, 64, 2, 15),
(375, 64, 2, 16),
(376, 64, 2, 17),
(377, 64, 2, 18),
(378, 64, 2, 19),
(379, 64, 2, 20),
(380, 64, 2, 21),
(381, 64, 2, 22),
(382, 64, 2, 23),
(383, 64, 2, 24),
(384, 64, 2, 25),
(385, 64, 2, 26),
(386, 64, 2, 27),
(387, 64, 3, 11),
(388, 64, 4, 12),
(389, 8, 1, 1),
(390, 8, 2, 10),
(391, 8, 2, 15),
(392, 8, 2, 17),
(393, 8, 2, 19),
(394, 8, 2, 21),
(395, 8, 2, 22),
(396, 8, 2, 24),
(397, 8, 3, 7),
(398, 8, 4, 8),
(399, 8, 1, 1),
(400, 8, 2, 16),
(401, 8, 2, 24),
(402, 8, 2, 25),
(403, 8, 3, 34),
(404, 8, 4, 8),
(405, 12, 1, 1),
(406, 12, 2, 16),
(407, 12, 2, 17),
(408, 12, 2, 18),
(409, 12, 2, 19),
(410, 12, 2, 20),
(411, 12, 2, 25),
(412, 12, 2, 26),
(413, 12, 2, 31),
(414, 12, 2, 32),
(415, 12, 3, 34),
(416, 12, 4, 8),
(417, 1, 1, 0),
(418, 1, 3, 0),
(419, 1, 4, 0),
(420, 8, 1, 0),
(421, 8, 3, 0),
(422, 8, 4, 0),
(423, 8, 1, 0),
(424, 8, 3, 0),
(425, 8, 4, 0),
(426, 44, 1, 3),
(427, 44, 2, 6),
(428, 44, 2, 10),
(429, 44, 2, 15),
(430, 44, 2, 16),
(431, 44, 2, 18),
(432, 44, 2, 19),
(433, 44, 2, 21),
(434, 44, 2, 22),
(435, 44, 2, 23),
(436, 44, 2, 24),
(437, 44, 2, 25),
(438, 44, 2, 30),
(439, 44, 3, 34),
(440, 44, 4, 12),
(441, 45, 1, 5),
(442, 45, 2, 6),
(443, 45, 2, 10),
(444, 45, 2, 17),
(445, 45, 2, 18),
(446, 45, 3, 7),
(447, 45, 4, 8),
(448, 46, 1, 2),
(449, 46, 2, 10),
(450, 46, 2, 14),
(451, 46, 3, 11),
(452, 46, 4, 8),
(453, 47, 1, 4),
(454, 47, 2, 6),
(455, 47, 2, 10),
(456, 47, 2, 14),
(457, 47, 2, 15),
(458, 47, 2, 16),
(459, 47, 2, 17),
(460, 47, 3, 7),
(461, 47, 4, 8),
(462, 48, 1, 4),
(463, 48, 2, 18),
(464, 48, 2, 21),
(465, 48, 2, 29),
(466, 48, 2, 30),
(467, 48, 3, 33),
(468, 48, 4, 12),
(469, 1, 1, 1),
(470, 1, 2, 6),
(471, 1, 2, 10),
(472, 1, 2, 15),
(473, 1, 2, 16),
(474, 1, 2, 18),
(475, 1, 2, 21),
(476, 1, 2, 31),
(477, 1, 2, 32),
(478, 1, 3, 7),
(479, 1, 4, 8),
(480, 50, 1, 1),
(481, 50, 2, 6),
(482, 50, 2, 10),
(483, 50, 2, 15),
(484, 50, 2, 16),
(485, 50, 2, 18),
(486, 50, 2, 19),
(487, 50, 2, 21),
(488, 50, 3, 7),
(489, 50, 4, 8),
(490, 51, 1, 1),
(491, 51, 2, 6),
(492, 51, 2, 10),
(493, 51, 3, 7),
(494, 51, 4, 8);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `position_id` (`position_id`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registered_users`
--
ALTER TABLE `registered_users`
  ADD PRIMARY KEY (`voter_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_votes`
--
ALTER TABLE `user_votes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `position_id` (`position_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `registered_users`
--
ALTER TABLE `registered_users`
  MODIFY `voter_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `user_votes`
--
ALTER TABLE `user_votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=495;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
