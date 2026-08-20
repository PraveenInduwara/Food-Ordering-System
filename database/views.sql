-- Food Ordering System - Views
USE FoodOrderingSystem;
GO

-- View 1: Pending orders with customer and restaurant details
CREATE VIEW vw_PendingOrders
AS
SELECT
    o.OrderID,
    c.FirstName + ' ' + c.LastName AS CustomerName,
    c.Phone AS CustomerPhone,
    r.Name AS RestaurantName,
    o.OrderDate,
    o.TotalAmount,
    o.Status,
    o.DeliveryAddress
FROM [Order] o
INNER JOIN Customer c ON o.CustomerID = c.CustomerID
INNER JOIN Restaurant r ON o.RestaurantID = r.RestaurantID
WHERE o.Status IN ('Pending', 'Confirmed', 'Preparing');
GO

-- View 2: Top selling menu items
CREATE VIEW vw_TopSellingItems
AS
SELECT
    m.MenuItemID,
    m.Name AS ItemName,
    r.Name AS RestaurantName,
    m.Price,
    m.Category,
    SUM(od.Quantity) AS TotalQuantitySold,
    SUM(od.Quantity * od.UnitPrice) AS TotalRevenue
FROM MenuItem m
INNER JOIN OrderDetails od ON m.MenuItemID = od.MenuItemID
INNER JOIN Restaurant r ON m.RestaurantID = r.RestaurantID
GROUP BY m.MenuItemID, m.Name, r.Name, m.Price, m.Category;
GO
