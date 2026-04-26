-- Create database
CREATE DATABASE IF NOT EXISTS mcq_platform;
USE mcq_platform;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  phone_number VARCHAR(20),
  profile_image VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MCQs table
CREATE TABLE IF NOT EXISTS mcqs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer INT NOT NULL, -- 0=A, 1=B, 2=C, 3=D
  category VARCHAR(50) NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  answers JSON,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (full_name, email, password, gender, role) 
VALUES ('Admin User', 'admin@mcq.com', '$2a$10$rQJ5qXKX9vXKX9vXKX9vXerRQJ5qXKX9vXKX9vXKX9vXerRQJ5qX', 'male', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample MCQs
INSERT INTO mcqs (question, option_a, option_b, option_c, option_d, correct_answer, category, created_by) VALUES
('What is 2 + 2?', '3', '4', '5', '6', 1, 'Mathematics', 1),
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 2, 'Geography', 1),
('Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 1, 'Science', 1),
('What does HTML stand for?', 'Hyper Text Markup Language', 'Hot Mail', 'How To Make Lasagna', 'Home Tool Markup Language', 0, 'Programming', 1),
('Who wrote Romeo and Juliet?', 'Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain', 1, 'English', 1),
('What is the largest ocean on Earth?', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean', 3, 'Geography', 1),
('What is the chemical symbol for Gold?', 'Go', 'Gd', 'Au', 'Ag', 2, 'Science', 1),
('Which programming language is known for Write Once, Run Anywhere?', 'Python', 'Java', 'C++', 'JavaScript', 1, 'Programming', 1),
('What is the square root of 64?', '6', '7', '8', '9', 2, 'Mathematics', 1),
('How many continents are there?', '5', '6', '7', '8', 2, 'General Knowledge', 1)
ON DUPLICATE KEY UPDATE question=question;
