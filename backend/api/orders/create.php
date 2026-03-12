<?php
// API Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';

// Instantiate DB & Connect
$db = $pdo;

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (
    !empty($data->items) &&
    !empty($data->firstName) &&
    !empty($data->email) &&
    !empty($data->total)
) {
    try {
        // Start transaction
        $db->beginTransaction();

        // 1. Create Order
        // Generate unique Order ID
        $orderId = 'ORD-' . strtoupper(uniqid());

        $sql = "INSERT INTO orders (
            order_id, user_id, first_name, last_name, email, phone, 
            address, city, state, zip, payment_method, total_amount, status
        ) VALUES (
            :order_id, :user_id, :first_name, :last_name, :email, :phone,
            :address, :city, :state, :zip, :payment_method, :total_amount, 'pending'
        )";

        $stmt = $db->prepare($sql);

        $stmt->execute([
            ':order_id' => $orderId,
            ':user_id' => isset($data->userId) ? $data->userId : null,
            ':first_name' => $data->firstName,
            ':last_name' => $data->lastName,
            ':email' => $data->email,
            ':phone' => $data->phone,
            ':address' => $data->address,
            ':city' => $data->city,
            ':state' => $data->state,
            ':zip' => $data->zip,
            ':payment_method' => $data->paymentMethod,
            ':total_amount' => $data->total
        ]);

        // 2. Insert Order Items & Update Stock
        $sqlItem = "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) 
                    VALUES (:order_id, :product_id, :product_name, :quantity, :price)";
        $stmtItem = $db->prepare($sqlItem);

        $sqlUpdateStock = "UPDATE products SET sales = sales + :qty, in_stock = CASE WHEN sales > 50 THEN FALSE ELSE TRUE END WHERE id = :pid"; 
        // Note: Simple stock logic for now. Real logic would use inventory count.
        $stmtUpdate = $db->prepare($sqlUpdateStock);

        foreach ($data->items as $item) {
            // Insert Item
            $stmtItem->execute([
                ':order_id' => $orderId,
                ':product_id' => $item->id,
                ':product_name' => $item->name,
                ':quantity' => $item->quantity,
                ':price' => $item->price
            ]);

            // Update Product Sales/Stock
            $stmtUpdate->execute([
                ':qty' => $item->quantity,
                ':pid' => $item->id
            ]);
        }

        // Commit transaction
        $db->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Order placed successfully',
            'orderId' => $orderId
        ]);

    } catch (Exception $e) {
        $db->rollBack();
        echo json_encode([
            'success' => false,
            'message' => 'Order creation failed: ' . $e->getMessage()
        ]);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Incomplete data']);
}
?>
