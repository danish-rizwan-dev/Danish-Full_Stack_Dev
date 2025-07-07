CREATE DATABASE AI_Resume_builder;
USE AI_Resume_builder;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(255),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE personalDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT UNIQUE,
    name VARCHAR(255),
    job_title VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE professionalExperience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT,
    position_title VARCHAR(255),
    company_name VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    start_date DATE,
    end_date DATE,
    summary TEXT,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT,
    institute_name VARCHAR(255),
    degree VARCHAR(255),
    state VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT,
    name VAR	CHAR(100),
    description TEXT,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);



drop database AI_Resume_builder;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS professionalExperience;
DROP TABLE IF EXISTS personalDetails;
DROP TABLE IF EXISTS resumes;
DROP TABLE IF EXISTS users;