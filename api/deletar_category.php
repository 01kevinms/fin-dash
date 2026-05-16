<?php
require_once '_helpers.php';
cabecalhos();
$id = isset($_POST['id']) ? trim($_POST['id']) : '';
if ($id === '') {
    http_response_code(400);
    echo json_encode(['erro' => 'id obrigatorio']);
    exit;
}
$db    = lerDB();
$antes = count($db['categories']);
$nova  = [];
foreach ($db['categories'] as $item) {
    if ((string)($item['id'] ?? '') !== $id) {
        $nova[] = $item;
    }
}
if (count($nova) === $antes) {
    http_response_code(404);
    echo json_encode(['erro' => 'Categoria nao encontrada']);
    exit;
}
$db['categories'] = $nova;
salvarDB($db);
echo json_encode(['deletado' => true, 'id' => $id], JSON_UNESCAPED_UNICODE);
