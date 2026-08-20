-- Food Ordering System - Sample Data (10 records per table)
USE FoodOrderingSystem;
GO

-- Customers
INSERT INTO Customer (FirstName, LastName, Email, Phone, Address) VALUES
('Kasun', 'Perera', 'kasun.perera@email.com', '0771234567', '12 Galle Road, Colombo 03'),
('Nimali', 'Fernando', 'nimali.f@email.com', '0712345678', '45 Kandy Road, Kadawatha'),
('Ashan', 'Silva', 'ashan.silva@email.com', '0761234567', '78 Main Street, Nugegoda'),
('Dilini', 'Jayawardena', 'dilini.j@email.com', '0781234567', '23 Temple Road, Dehiwala'),
('Ruwan', 'Bandara', 'ruwan.b@email.com', '0751234567', '56 Lake Drive, Kandy'),
('Sachini', 'Rathnayake', 'sachini.r@email.com', '0721234567', '89 Hill Street, Galle'),
('Tharindu', 'Wickrama', 'tharindu.w@email.com', '0741234567', '34 Park Avenue, Negombo'),
('Hashini', 'Dissanayake', 'hashini.d@email.com', '0701234567', '67 Beach Road, Matara'),
('Kavinda', 'Rajapaksha', 'kavinda.r@email.com', '0771122334', '90 Station Road, Kurunegala'),
('Sanduni', 'Herath', 'sanduni.h@email.com', '0711122334', '15 Market Street, Ratnapura');

-- Restaurants
INSERT INTO Restaurant (Name, Address, Phone, CuisineType, Rating) VALUES
('Colombo Kitchen', '100 Galle Road, Colombo 03', '0112345678', 'Sri Lankan', 4.5),
('Spice Garden', '25 Duplication Road, Colombo 04', '0112345679', 'Indian', 4.2),
('Dragon Palace', '50 Union Place, Colombo 02', '0112345680', 'Chinese', 4.0),
('Pizza Hub', '75 Thimbirigasyaya Road, Colombo 05', '0112345681', 'Italian', 3.8),
('Burger Town', '30 Baseline Road, Colombo 09', '0112345682', 'American', 4.1),
('Sushi World', '60 Park Street, Colombo 02', '0112345683', 'Japanese', 4.3),
('Noodle House', '15 Havelock Road, Colombo 06', '0112345684', 'Thai', 3.9),
('Curry Pot', '40 High Level Road, Nugegoda', '0112345685', 'Sri Lankan', 4.4),
('Grill Master', '85 Nawala Road, Rajagiriya', '0112345686', 'BBQ', 4.0),
('Sweet Treats', '20 Bauddhaloka Mawatha, Colombo 07', '0112345687', 'Desserts', 4.6);

-- Menu Items (spread across restaurants)
INSERT INTO MenuItem (RestaurantID, Name, Description, Price, Category) VALUES
(1, 'Rice and Curry', 'Traditional Sri Lankan rice with 3 curries', 650.00, 'Main Course'),
(1, 'Kottu Roti', 'Chopped roti with vegetables and chicken', 750.00, 'Main Course'),
(2, 'Butter Chicken', 'Creamy tomato-based chicken curry', 1200.00, 'Main Course'),
(2, 'Garlic Naan', 'Freshly baked garlic naan bread', 250.00, 'Bread'),
(3, 'Fried Rice', 'Special Chinese-style fried rice', 850.00, 'Main Course'),
(3, 'Sweet and Sour Chicken', 'Crispy chicken in sweet and sour sauce', 1100.00, 'Main Course'),
(4, 'Margherita Pizza', 'Classic pizza with mozzarella and basil', 1500.00, 'Pizza'),
(5, 'Classic Burger', 'Beef patty with lettuce, tomato, and cheese', 950.00, 'Burger'),
(6, 'Salmon Sushi Roll', 'Fresh salmon with avocado roll', 1800.00, 'Sushi'),
(7, 'Pad Thai', 'Stir-fried rice noodles with shrimp', 1050.00, 'Noodles');

-- Orders
INSERT INTO [Order] (CustomerID, RestaurantID, OrderDate, Status, DeliveryAddress) VALUES
(1, 1, '2025-07-01 12:30:00', 'Delivered', '12 Galle Road, Colombo 03'),
(2, 2, '2025-07-02 13:00:00', 'Delivered', '45 Kandy Road, Kadawatha'),
(3, 3, '2025-07-03 18:30:00', 'Delivered', '78 Main Street, Nugegoda'),
(4, 4, '2025-07-04 19:00:00', 'Confirmed', '23 Temple Road, Dehiwala'),
(5, 5, '2025-07-05 12:00:00', 'Preparing', '56 Lake Drive, Kandy'),
(1, 6, '2025-07-06 20:00:00', 'Pending', '12 Galle Road, Colombo 03'),
(6, 1, '2025-07-07 11:30:00', 'Delivered', '89 Hill Street, Galle'),
(7, 7, '2025-07-08 14:00:00', 'Cancelled', '34 Park Avenue, Negombo'),
(8, 3, '2025-07-09 19:30:00', 'Pending', '67 Beach Road, Matara'),
(9, 2, '2025-07-10 13:30:00', 'Confirmed', '90 Station Road, Kurunegala');

-- Order Details
INSERT INTO OrderDetails (OrderID, MenuItemID, Quantity, UnitPrice) VALUES
(1, 1, 2, 650.00),
(1, 2, 1, 750.00),
(2, 3, 1, 1200.00),
(2, 4, 2, 250.00),
(3, 5, 2, 850.00),
(3, 6, 1, 1100.00),
(4, 7, 1, 1500.00),
(5, 8, 2, 950.00),
(6, 9, 3, 1800.00),
(7, 1, 1, 650.00);
