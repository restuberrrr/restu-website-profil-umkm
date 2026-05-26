<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$pdo = new PDO('mysql:host=127.0.0.1;dbname=website_profil_umkm;charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: [];
$id = $_GET['id'] ?? null;

if ($method === 'GET') {
    echo json_encode($pdo->query('SELECT * FROM products ORDER BY id DESC')->fetchAll());
    exit;
}

if ($method === 'POST') {
    $stmt = $pdo->prepare('INSERT INTO products (name, category, price, description) VALUES (?, ?, ?, ?)');
    $stmt->execute([$input['name'], $input['category'], (int) $input['price'], $input['description']]);
    echo json_encode(['message' => 'created']);
    exit;
}

if ($method === 'PUT' && $id) {
    $stmt = $pdo->prepare('UPDATE products SET name = ?, category = ?, price = ?, description = ? WHERE id = ?');
    $stmt->execute([$input['name'], $input['category'], (int) $input['price'], $input['description'], $id]);
    echo json_encode(['message' => 'updated']);
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode(['message' => 'deleted']);
    exit;
}

http_response_code(400);
echo json_encode(['message' => 'Bad request']);

