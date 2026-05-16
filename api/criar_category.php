<?php
require_once '_helpers.php';
cabecalhos();
$body = dadosPost();
if (empty($body)) {
    http_response_code(400);
    echo json_encode(['erro' => 'Body vazio']);
    exit;
}
$db = lerDB();
if (empty($body['id'])) {
    $body['id'] = gerarId('cat');
}
$db['categories'][] = $body;
salvarDB($db);
http_response_code(201);
echo json_encode($body, JSON_UNESCAPED_UNICODE);
