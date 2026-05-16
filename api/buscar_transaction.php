<?php
require_once '_helpers.php';
cabecalhos();
$id = isset($_POST['id']) ? trim($_POST['id']) : '';
if ($id === '') {
    http_response_code(400);
    echo json_encode(['erro' => 'id obrigatorio']);
    exit;
}
$db = lerDB();
foreach ($db['transactions'] as $item) {
    if (isset($item['id']) && $item['id'] === $id) {
        echo json_encode($item, JSON_UNESCAPED_UNICODE);
        exit;
    }
}
http_response_code(404);
echo json_encode(['erro' => 'Transacao nao encontrada']);
