-- Food Ordering System - User Defined Functions
USE FoodOrderingSystem;
GO

-- Function 1: Calculate total cost of an order
CREATE FUNCTION fn_CalculateOrderTotal(@OrderID INT)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @Total DECIMAL(10,2);

    SELECT @Total = ISNULL(SUM(Quantity * UnitPrice), 0)
    FROM OrderDetails
    WHERE OrderID = @OrderID;

    RETURN @Total;
END;
GO

-- Function 2: Get total number of items in an order
CREATE FUNCTION fn_GetOrderItemCount(@OrderID INT)
RETURNS INT
AS
BEGIN
    DECLARE @Count INT;

    SELECT @Count = ISNULL(SUM(Quantity), 0)
    FROM OrderDetails
    WHERE OrderID = @OrderID;

    RETURN @Count;
END;
GO
