-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: pdv
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `idcliente` int NOT NULL AUTO_INCREMENT,
  `nome_cli` varchar(50) NOT NULL,
  `sobrenome` varchar(45) NOT NULL,
  `endereco` varchar(45) DEFAULT NULL,
  `bairro` varchar(45) DEFAULT NULL,
  `cidade` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `cep` varchar(45) NOT NULL,
  PRIMARY KEY (`idcliente`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'jojo','teste','teste','teste','teste','teste','12345678'),(2,'joao','teste','teste','teste','teste','pj','99988777'),(3,'nanci','teste','teste','teste','teste','teste','11111222'),(4,'paulo','teste','teste','teste','teste','pj','99988777'),(5,'nanci','teste','teste','teste','teste','pj','12345678'),(6,'jojo','teste','rua','teste','teste','pj','11111222'),(7,'joao','teste','rua','teste','teste','pj','99988777'),(8,'jojo','teste','rua','teste','teste','pj','12345678'),(9,'Gigi','Cristina','teste','nogueira','barretos','teste','99988777'),(10,'Pedro','Augusto','Avenida Principal','Mais Parque','Barretos','SP','14785000');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `data_compra` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `forma_pagamento` varchar(50) DEFAULT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `desconto` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`idcliente`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,9,'2023-12-30 11:20:53','A Vista',300.00,0.00),(6,9,'2023-12-30 12:15:38','A Vista',300.00,0.00),(7,9,'2023-12-30 12:18:29','A Vista',150.00,0.00),(8,9,'2023-12-30 12:24:26','A Vista',460.00,0.00),(9,9,'2023-12-30 12:31:20','A Vista',460.00,0.00),(10,9,'2023-12-30 12:38:46','A Vista',150.00,0.00),(11,9,'2023-12-30 12:40:28','A Vista',150.00,0.00),(12,9,'2023-12-30 12:42:44','A Vista',230.00,0.00),(13,9,'2023-12-30 13:19:12','Cartao de Credito',119.90,0.00),(14,9,'2023-12-30 13:19:16','Cartao de Credito',119.90,0.00),(15,10,'2023-12-30 15:50:19','A Vista',130.00,0.00);
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itens_compra`
--

DROP TABLE IF EXISTS `itens_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens_compra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `id_produto` int NOT NULL,
  `quantidade` int NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_compra` (`id_compra`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `itens_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id`),
  CONSTRAINT `itens_compra_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`idproduto`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens_compra`
--

LOCK TABLES `itens_compra` WRITE;
/*!40000 ALTER TABLE `itens_compra` DISABLE KEYS */;
INSERT INTO `itens_compra` VALUES (1,6,1,2,150.00),(2,7,1,1,150.00),(3,8,2,2,230.00),(4,9,2,2,230.00),(5,10,1,1,150.00),(6,11,1,1,150.00),(7,12,2,1,230.00),(8,13,3,1,119.90),(9,14,3,1,119.90),(10,15,4,1,130.00);
/*!40000 ALTER TABLE `itens_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `idproduto` int NOT NULL AUTO_INCREMENT,
  `produto` varchar(45) NOT NULL,
  `quantidade` int NOT NULL,
  `valor` float NOT NULL,
  `tipo` varchar(45) NOT NULL,
  `marca` varchar(45) NOT NULL,
  PRIMARY KEY (`idproduto`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
INSERT INTO `produto` VALUES (1,'Malbec',0,150,'Perfume','Boticario'),(2,'Lily',0,230,'Creme','Boticario'),(3,'Elysee',0,119.9,'Creme','Boticario'),(4,'Kaiak Tradicional',4,130,'Perfume','Natura'),(5,'Florata',3,185,'Perfume','Boticario');
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'pdv'
--

--
-- Dumping routines for database 'pdv'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-30 13:01:40
