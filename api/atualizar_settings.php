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
$db['settings'] = array_merge($db['settings'], $body);
salvarDB($db);
echo json_encode($db['settings'], JSON_UNESCAPED_UNICODE);
