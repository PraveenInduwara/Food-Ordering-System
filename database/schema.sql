-- Food Ordering System - Database Schema
-- MS SQL Server

CREATE DATABASE FoodOrderingSystem;
GO

USE FoodOrderingSystem;
GO

-- Customer Table
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(15) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Restaurant Table
CREATE TABLE Restaurant (
    RestaurantID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    Phone VARCHAR(15) NOT NULL,
    CuisineType VARCHAR(50) NOT NULL,
    Rating DECIMAL(2,1) DEFAULT 0.0 CHECK (Rating >= 0 AND Rating <= 5),
    IsActive BIT DEFAULT 1
);

-- MenuItem Table
CREATE TABLE MenuItem (
    MenuItemID INT PRIMARY KEY IDENTITY(1,1),
    RestaurantID INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(300),
    Price DECIMAL(10,2) NOT NULL CHECK (Price > 0),
    Category VARCHAR(50) NOT NULL,
    IsAvailable BIT DEFAULT 1,
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID)
);

-- Order Table
CREATE TABLE [Order] (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    RestaurantID INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) DEFAULT 0.00,
    Status VARCHAR(20) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled')),
    DeliveryAddress VARCHAR(200) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID)
);

-- OrderDetails Table
CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    MenuItemID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(10,2) NOT NULL,
    Subtotal AS (Quantity * UnitPrice),
    FOREIGN KEY (OrderID) REFERENCES [Order](OrderID),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItem(MenuItemID)
);
