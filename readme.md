# Node Login

[![node-login](./readme.img/node-login.jpg?raw=true)](https://nodejs-login.herokuapp.com)

### A basic account management system built in Node.js with the following features:

* Create question 
* Login  
## Pre-requesites
* Mysql database 
## Installation & Setup
1. Clone this repository and install its dependencies.
		
		> git clone git://github.com/braitsch/node-login.git node-login
		> cd test_auto
		> npm install
2. From within the node-login directory start the server.

		> CREATE TABLE `quiz_admin`.`user` (
			`id_user` INT NOT NULL AUTO_INCREMENT,
			`username` VARCHAR(45) NULL DEFAULT NULL,
			`password` VARCHAR(45) NULL DEFAULT NULL,
			`role` VARCHAR(45) NULL DEFAULT NULL,
			PRIMARY KEY (`id_user`));

			INSERT INTO `quiz_admin`.`user`
			(
			`username`,
			`password`,
			`role`)
			VALUES
			(
			"usuario_admin",
			"1234",
			"admin");
			INSERT INTO `quiz_admin`.`user`
			(
			`username`,
			`password`,
			`role`)
			VALUES
			(
			""usuario_user",
			"1234",
			"usuario");

			CREATE TABLE `quiz_admin`.`user_session` (
			`session_id` INT NOT NULL AUTO_INCREMENT,
			`expires` DATETIME NULL,
			`data` VARCHAR(255) NULL,
			PRIMARY KEY (`session_id`));


			CREATE TABLE `quiz_admin`.`question` (
			`id_question` INT NOT NULL AUTO_INCREMENT,
			`id_user` INT NULL,
			`respuesta_1` VARCHAR(45) NULL,
			`respuesta_2` VARCHAR(45) NULL,
			`respuesta_3` VARCHAR(45) NULL,
			PRIMARY KEY (`id_question`));

			ALTER TABLE question
			ADD CONSTRAINT FK_question
			FOREIGN KEY (id_user) REFERENCES user(id_user);
	
3. Open a browser window and navigate to: [http://localhost:3000](http://localhost:3000)
## Source
	* Node.js Login Boilerplate
	* More Info : https://github.com/braitsch/node-login
	* Copyright (c) 2013-2020 Stephen Braitsch
