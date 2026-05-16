<?php
require_once '_helpers.php';
cabecalhos();
$id   = isset($_POST['id']) ? trim($_POST['id']) : '';
$body = dadosPost();
if ($id === '') {
    http_response_code(400);
    echo json_encode(['erro' => 'id obrigatorio']);
    exit;
}
if (empty($body)) {
    http_response_code(400);
    echo json_encode(['erro' => 'Body vazio']);
    exit;
}
$db = lerDB();
$encontrado = false;
$atualizado = [];
foreach ($db['categories'] as $k => $item) {
    if (isset($item['id']) && $item['id'] === $id) {
        $merged = array_merge($item, $body);
        $merged['id'] = $id;
        $db['categories'][$k] = $merged;
        $atualizado = $merged;
        $encontrado = true;
        break;
    }
}
if (!$encontrado) {
    http_response_code(404);
    echo json_encode(['erro' => 'Categoria nao encontrada']);
    exit;
}
salvarDB($db);
echo json_encode($atualizado, JSON_UNESCAPED_UNICODE);
