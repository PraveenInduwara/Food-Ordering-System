-- Food Ordering System - Stored Procedures
USE FoodOrderingSystem;
GO

-- Stored Procedure 1: Place a new order with items
CREATE PROCEDURE sp_PlaceOrder
    @CustomerID INT,
    @RestaurantID INT,
    @DeliveryAddress VARCHAR(200),
    @MenuItemIDs VARCHAR(500),    -- Comma-separated MenuItemIDs
    @Quantities VARCHAR(500)       -- Comma-separated Quantities
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insert the order
        DECLARE @OrderID INT;
        INSERT INTO [Order] (CustomerID, RestaurantID, DeliveryAddress, Status)
        VALUES (@CustomerID, @RestaurantID, @DeliveryAddress, 'Pending');

        SET @OrderID = SCOPE_IDENTITY();

        -- Parse and insert order details using STRING_SPLIT
        DECLARE @Items TABLE (RowNum INT IDENTITY(1,1), ItemID INT);
        DECLARE @Qtys TABLE (RowNum INT IDENTITY(1,1), Qty INT);

        INSERT INTO @Items (ItemID)
        SELECT CAST(value AS INT) FROM STRING_SPLIT(@MenuItemIDs, ',');

        INSERT INTO @Qtys (Qty)
        SELECT CAST(value AS INT) FROM STRING_SPLIT(@Quantities, ',');

        INSERT INTO OrderDetails (OrderID, MenuItemID, Quantity, UnitPrice)
        SELECT @OrderID, i.ItemID, q.Qty, m.Price
        FROM @Items i
        INNER JOIN @Qtys q ON i.RowNum = q.RowNum
        INNER JOIN MenuItem m ON i.ItemID = m.MenuItemID;

        COMMIT TRANSACTION;

        SELECT @OrderID AS NewOrderID;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Stored Procedure 2: Monthly sales report
CREATE PROCEDURE sp_MonthlySalesReport
    @Year INT,
    @Month INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        r.Name AS RestaurantName,
        COUNT(DISTINCT o.OrderID) AS TotalOrders,
        SUM(o.TotalAmount) AS TotalRevenue,
        AVG(o.TotalAmount) AS AverageOrderValue
    FROM [Order] o
    INNER JOIN Restaurant r ON o.RestaurantID = r.RestaurantID
    WHERE YEAR(o.OrderDate) = @Year
      AND MONTH(o.OrderDate) = @Month
      AND o.Status != 'Cancelled'
    GROUP BY r.Name
    ORDER BY TotalRevenue DESC;
END;
GO
