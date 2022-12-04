-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 04 Des 2022 pada 16.49
-- Versi server: 10.4.24-MariaDB
-- Versi PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `m-bca`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_daftartransfer`
--

CREATE TABLE `tb_daftartransfer` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `no_rek` varchar(100) NOT NULL,
  `bank` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `tb_daftartransfer`
--

INSERT INTO `tb_daftartransfer` (`id`, `id_user`, `no_rek`, `bank`, `createdAt`, `updatedAt`) VALUES
(1, 6, '2122853427', 'BNI', '2022-12-02 09:53:41', '2022-12-02 09:53:41'),
(3, 6, '2122853427', 'BRI', '2022-12-02 09:57:19', '2022-12-02 09:57:19'),
(4, 6, '2122853427', 'BCA', '2022-12-02 10:27:50', '2022-12-02 10:27:50'),
(5, 6, '512251765', 'BCA', '2022-12-02 10:29:54', '2022-12-02 10:29:54'),
(6, 6, '1122720929', 'BCA', '2022-12-02 10:32:51', '2022-12-02 10:32:51'),
(7, 6, '8122316625', 'BCA', '2022-12-02 10:34:06', '2022-12-02 10:34:06'),
(8, 6, '1122411727', 'BNI', '2022-12-02 15:51:38', '2022-12-02 15:51:38'),
(9, 2, '1122411727', 'BNI', '2022-12-04 15:44:47', '2022-12-04 15:44:47'),
(10, 2, '2122853427', 'MANDIRI', '2022-12-04 15:46:15', '2022-12-04 15:46:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_users`
--

CREATE TABLE `tb_users` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `pin` int(6) DEFAULT NULL,
  `saldo` varchar(255) DEFAULT '0',
  `jenis_card` varchar(255) DEFAULT NULL,
  `no_rek` varchar(100) DEFAULT NULL,
  `no_card` varchar(255) DEFAULT NULL,
  `kode_akses` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `tb_users`
--

INSERT INTO `tb_users` (`id`, `nama`, `email`, `password`, `pin`, `saldo`, `jenis_card`, `no_rek`, `no_card`, `kode_akses`, `ip_address`, `refresh_token`, `createdAt`, `updatedAt`) VALUES
(2, 'muhammad akbar', 'akbar@gmail.com', '$2b$10$pRqaihX173OJE2APWoKF4.qQWe5zGXjk/tme9ocIbsZc/bL/jcG5W', 654321, '4000000', 'blue', '1122411727', '4333881121727241', 'akbar1', '114.124.245.74', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsIm5hbWEiOiJtdWhhbW1hZCBha2JhciIsImlhdCI6MTY3MDE2ODc1NSwiZXhwIjoxNjcwMjU1MTU1fQ.k-4URAk-RS76FmcxBJpL8nL8KNJ_XkW44eTUvR2proI', '2022-11-13 13:11:27', '2022-12-04 15:45:55'),
(3, 'joko', 'joko@gmail.com', '$2b$10$.uBzXgwV5HgxaDJ/oCIxqeC90gRd86F.dd9JbCJQLKzqQUDRUy74C', 654321, '125000', 'blue', '8122316625', '7708806162538221', 'joko12', '103.247.21.192', NULL, '2022-11-13 13:16:25', '2022-12-02 14:47:14'),
(4, 'joko2', 'joko2@gmail.com', '$2b$10$JeUpm3HaS1UQESmOhpZaBu4SrDGhNFzzskupaxW4HLAn5lEysxtoG', 654321, '100000', 'blue', '1122720929', '6869980922212791', 'joko2', '103.247.21.192', NULL, '2022-11-13 13:20:29', '2022-11-13 13:20:29'),
(5, 'joko', 'joko01@gmail.com', '$2b$10$hJ2gz4AG4TYjeCwrOi4E0uA3r8Cmayx7dbz6GN4xDplnQO.Z8rYsC', 123456, '100000', 'blue', '7122251330', '2197741173222530', 'joko01', '101.255.119.66', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsIm5hbWEiOiJqb2tvIiwiaWF0IjoxNjY5ODEzMzQ0LCJleHAiOjE2Njk4OTk3NDR9.vuEqGhodpPUnvTFmqUU0DEe8n71mHf2s0uJrKn_92JY', '2022-11-25 06:51:30', '2022-11-30 13:02:24'),
(6, 'joni', 'joni@gmail.com', '$2b$10$uQufFqzuG1zkTzrFEJ1FXOZwCHTqCTEhbrzf3opH70WPxyCwgueFq', 121212, '30000', 'blue', '512251765', '6162852155216570', 'joni01', '101.255.119.66', NULL, '2022-11-29 16:17:05', '2022-12-04 06:56:01'),
(7, 'jojo', 'jojo@gmail.com', '$2b$10$10joU5ip3ksVIR3dzESudeRC1zhXKNHrHtGo6sJpqRuB7Jzwi695G', 121212, '0', 'blue', '2122853427', '9489292132228457', 'jojo01', '101.255.118.193', NULL, '2022-11-30 09:53:27', '2022-12-02 14:45:23');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tb_daftartransfer`
--
ALTER TABLE `tb_daftartransfer`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tb_daftartransfer`
--
ALTER TABLE `tb_daftartransfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `tb_users`
--
ALTER TABLE `tb_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
