-- Food Ordering System - Triggers
USE FoodOrderingSystem;
GO

-- Trigger 1: Auto-update order total when OrderDetails are inserted or updated
CREATE TRIGGER trg_UpdateOrderTotal
ON OrderDetails
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Update totals for affected orders
    UPDATE [Order]
    SET TotalAmount = (
        SELECT ISNULL(SUM(Quantity * UnitPrice), 0)
        FROM OrderDetails
        WHERE OrderDetails.OrderID = [Order].OrderID
    )
    WHERE OrderID IN (
        SELECT OrderID FROM inserted
        UNION
        SELECT OrderID FROM deleted
    );
END;
GO

-- Trigger 2: Prevent deleting a restaurant that has active orders
CREATE TRIGGER trg_PreventRestaurantDelete
ON Restaurant
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM [Order] o
        INNER JOIN deleted d ON o.RestaurantID = d.RestaurantID
        WHERE o.Status NOT IN ('Delivered', 'Cancelled')
    )
    BEGIN
        RAISERROR('Cannot delete restaurant with active orders.', 16, 1);
        RETURN;
    END

    DELETE FROM Restaurant
    WHERE RestaurantID IN (SELECT RestaurantID FROM deleted);
END;
GO
